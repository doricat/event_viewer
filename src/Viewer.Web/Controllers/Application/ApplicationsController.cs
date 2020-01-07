using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Viewer.Web.ApiFilter;
using Viewer.Web.ApiModels;
using Viewer.Web.Controllers.Application;
using Viewer.Web.Data;
using Viewer.Web.Data.Entities;
using Viewer.Web.Extensions;
using Viewer.Web.Utilities;

namespace Viewer.Web.Controllers
{
    [Route("api/applications")]
    [ApiController]
    [Authorize]
    public class ApplicationsController : ControllerBase
    {
        public ApplicationsController(ILogger<ApplicationsController> logger,
            ApplicationManager applicationManager,
            IdentityGenerator identityGenerator,
            EventManager eventManager)
        {
            Logger = logger;
            ApplicationManager = applicationManager;
            IdentityGenerator = identityGenerator;
            EventManager = eventManager;
        }

        public ILogger<ApplicationsController> Logger { get; }

        public ApplicationManager ApplicationManager { get; }

        public IdentityGenerator IdentityGenerator { get; }

        public EventManager EventManager { get; }

        [HttpGet]
        public Task<IActionResult> Get()
        {
            var isAdmin = User.IsInRole("admin");
            var userId = long.Parse(User.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value);
            var query = isAdmin ? ApplicationManager.Applications : ApplicationManager.Applications.Where(x => x.Enabled && x.Users.Any(y => y.UserId == userId));
            var listTask = query.OrderBy(x => x.Id).ToListAsync(HttpContext.RequestAborted);
            var countTask = query.CountAsync(HttpContext.RequestAborted);

            Task.WaitAll(listTask, countTask);

            return Task.FromResult<IActionResult>(
                Ok(new PagedResult<IList<ApplicationGetOutputModel>>(
                    listTask.Result.Select(x => new ApplicationGetOutputModel
                    {
                        Id = x.Id,
                        AppId = x.ApplicationId,
                        Name = x.Name,
                        Enabled = x.Enabled,
                        Description = x.Description
                    }).ToList()) {Count = countTask.Result}));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var (app, count) = await ApplicationManager.FindDetailByIdAsync(id);
            if (app == null)
            {
                var msg = $"找不到指定的应用程序 {id}";
                Logger.LogWarning(msg);
                return NotFound(new ApiErrorResult<ApiError>(new ApiError(ApiErrorCodes.ObjectNotFound, msg)));
            }

            var result = new ApplicationDetailGetOutputModel
            {
                Id = app.Id,
                AppId = app.ApplicationId,
                Name = app.Name,
                Enabled = app.Enabled,
                Description = app.Description,
                EventCount = count,
                UserList = app.Users.Select(x => x.UserId).ToList()
            };

            return Ok(new ApiResult<ApplicationDetailGetOutputModel>(result));
        }

        [HttpGet("{id}/events")]
        public Task<IActionResult> Get(long id, // 简化只支持id
            [FromQuery(Name = "$filter")] FilterModel<EventFilterModel> filter,
            [FromQuery(Name = "$top")] int top = 20,
            [FromQuery(Name = "$skip")] int skip = 0)
        {
            if (filter != null && !string.IsNullOrWhiteSpace(filter.FilterExpr))
            {
                Logger.LogDebug(filter.FilterExpr);
            }

            var parameter = Expression.Parameter(typeof(Event), "x");
            var appIdPropExpr = Expression.Property(parameter, "ApplicationId");
            var appIdValueExpr = Expression.Constant(id);
            var expr2 = Expression.Equal(appIdPropExpr, appIdValueExpr);
            Expression<Func<Event, bool>> lambda;

            if (filter?.Node != null)
            {
                var expr = filter.Node.ToExpression(parameter);
                lambda = Expression.Lambda<Func<Event, bool>>(Expression.AndAlso(expr2, expr), parameter);
            }
            else
            {
                lambda = Expression.Lambda<Func<Event, bool>>(expr2, parameter);
            }

            var listTask = EventManager.Events.OrderByDescending(x => x.TimeStamp).Where(lambda).Skip(skip).Take(top).ToListAsync(HttpContext.RequestAborted);
            var countTask = EventManager.Events.CountAsync(lambda, HttpContext.RequestAborted);

            Task.WaitAll(listTask, countTask);

            return Task.FromResult<IActionResult>(
                Ok(new PagedResult<IList<EventListGetModel>>(
                    listTask.Result.Select(x => new EventListGetModel
                    {
                        Id = x.Id,
                        ApplicationId = x.ApplicationId,
                        Category = x.Category,
                        Level = x.Level,
                        Message = x.Message,
                        ProcessId = x.ProcessId,
                        Timestamp = x.TimeStamp
                    }).ToList())
                {
                    Count = countTask.Result,
                    Sorts = new[] {"timestamp desc"}
                }));
        }

        [HttpGet("{id}/events/statistics/{level:regex(^(critical|error|warning|information|debug|trace)$)}")]
        public async Task<IActionResult> Get(string id, [FromRoute] string level)
        {
            var app = await ApplicationManager.FindByIdAsync(id);
            if (app == null)
            {
                var msg = $"找不到指定的应用程序 {id}";
                Logger.LogWarning(msg);
                return NotFound(new ApiErrorResult<ApiError>(new ApiError(ApiErrorCodes.ObjectNotFound, msg)));
            }

            var result = await ApplicationManager.GetEventStatisticsAsync(app, level);
            return Ok(new ApiResult<EventStatisticsResult>(result));
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(DemoFilterAttribute))]
        public async Task<IActionResult> Post([FromBody] ApplicationPostModel model)
        {
            if (await ApplicationManager.Applications.AnyAsync(x => x.Name == model.Name || x.ApplicationId == model.AppId))
            {
                return BadRequest(new ApiErrorResult<ApiError>(new ApiError(ApiErrorCodes.BadArgument, "存在重复的名称或应用程序Id。")));
            }

            var app = new Data.Entities.Application
            {
                Id = await IdentityGenerator.GenerateAsync(),
                Name = model.Name,
                ApplicationId = model.AppId,
                Description = model.Description,
                Enabled = model.Enabled
            };
            var result = await ApplicationManager.CreateApplicationAsync(app);

            if (result.Succeeded)
            {
                return StatusCode(201,
                    new ApiResult<ObjectCreationOutputModel<long>>(new ObjectCreationOutputModel<long>(app.Id,
                        $"{Request.Scheme}://{Request.Host.Value}/api/applications/{app.Id}")));
            }

            throw new NotImplementedException();
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(DemoFilterAttribute))]
        public async Task<IActionResult> Put(string id, [FromBody] ApplicationPostModel model)
        {
            var app = await ApplicationManager.FindByIdAsync(id);
            if (app != null)
            {
                app.Name = model.Name;
                app.ApplicationId = model.AppId;
                app.Description = model.Description;
                app.Enabled = model.Enabled;

                var result = await ApplicationManager.UpdateAsync(app);

                if (result.Succeeded)
                {
                    return NoContent();
                }

                throw new NotImplementedException();
            }

            var msg = $"找不到指定的应用程序 {id}";
            Logger.LogWarning(msg);
            return NotFound(new ApiErrorResult<ApiError>(new ApiError(ApiErrorCodes.ObjectNotFound, msg)));
        }

        [HttpPatch("{id}")]
        [ServiceFilter(typeof(DemoFilterAttribute))]
        public async Task<IActionResult> Patch(string id, [FromBody] ApplicationPatchSubscribersModel model)
        {
            var app = await ApplicationManager.FindByIdAsync(id);
            if (app == null)
            {
                var msg = $"找不到指定的应用程序 {id}";
                Logger.LogWarning(msg);
                return NotFound(new ApiErrorResult<ApiError>(new ApiError(ApiErrorCodes.ObjectNotFound, msg)));
            }

            var result = await ApplicationManager.SetSubscribersAsync(app, model.UserList);
            if (result.Succeeded)
            {
                return NoContent();
            }

            throw new NotImplementedException();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(DemoFilterAttribute))]
        public async Task<IActionResult> Delete(string id)
        {
            var app = await ApplicationManager.FindByIdAsync(id);
            if (app != null)
            {
                var result = await ApplicationManager.RemoveApplicationAsync(app);
                if (result.Succeeded)
                {
                    return NoContent();
                }

                throw new NotImplementedException();
            }

            return NotFound(new ApiErrorResult<ApiError>(new ApiError(ApiErrorCodes.ObjectNotFound, $"找不到指定的应用程序 {id}")));
        }
    }
}