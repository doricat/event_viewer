using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Viewer.Web.ApiModels;
using Viewer.Web.Data;
using Viewer.Web.Data.Entities;
using Viewer.Web.Extensions;
using Viewer.Web.Utilities;
using Viewer.Web.ViewModels.Application;
using WebApi.Filter;
using WebApi.Models;

namespace Viewer.Web.Controllers
{
    [Route("api/applications")]
    [ApiController]
    //[Authorize]
    public class ApplicationsController : ControllerBase
    {
        private readonly ILogger<ApplicationsController> _logger;
        private readonly ApplicationManager _applicationManager;
        private readonly IdentityGenerator _identityGenerator;
        private readonly EventManager _eventManager;

        public ApplicationsController(ILogger<ApplicationsController> logger,
            ApplicationManager applicationManager,
            IdentityGenerator identityGenerator,
            EventManager eventManager)
        {
            _logger = logger;
            _applicationManager = applicationManager;
            _identityGenerator = identityGenerator;
            _eventManager = eventManager;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var isAdmin = User.IsInRole("admin");
            var userId = long.Parse(User.Claims.First(x => x.Type == "sub").Value);
            var query = isAdmin
                ? _applicationManager.Applications
                : _applicationManager.Applications.Where(x => x.Enabled && x.Users.Any(y => y.UserId == userId));
            var list = await query.OrderBy(x => x.Id).ToListAsync(HttpContext.RequestAborted);
            var count = await query.CountAsync(HttpContext.RequestAborted);

            return Ok(new PagedResult<IList<ApplicationGetOutputModel>>(
                    list.Select(ApplicationGetOutputModel.FromApplication).ToList())
            { Count = count });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var (app, count) = await _applicationManager.FindDetailByIdAsync(id);
            if (app == null)
            {
                var msg = $"找不到指定的应用程序 {id}";
                _logger.LogWarning(msg);
                return NotFound(new ApiErrorResult<ApiError>(new ApiError(ApiErrorCodes.ObjectNotFound, msg)));
            }

            var result = ApplicationDetailGetOutputModel.FromApplication(app, count);
            return Ok(new ApiResult<ApplicationDetailGetOutputModel>(result));
        }

        [HttpGet("{id}/events")]
        public async Task<IActionResult> Get(long id, // 简化只支持id
            [FromQuery(Name = "$filter")] FilterModel<EventFilterModel> filter,
            [FromQuery(Name = "$top")] int top = 20,
            [FromQuery(Name = "$skip")] int skip = 0)
        {
            if (filter != null && !string.IsNullOrWhiteSpace(filter.FilterExpr))
            {
                _logger.LogDebug(filter.FilterExpr);
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

            var list = await _eventManager.Events.OrderByDescending(x => x.TimeStamp)
                .Where(lambda)
                .Skip(skip)
                .Take(top)
                .ToListAsync(HttpContext.RequestAborted);
            var count = await _eventManager.Events.CountAsync(lambda, HttpContext.RequestAborted);

            return Ok(new PagedResult<IList<EventListGetModel>>(list.Select(EventListGetModel.FromEvent).ToList())
            {
                Count = count,
                Sorts = new[] { "timestamp desc" }
            });
        }

        [HttpGet("{id}/events/statistics/{level:regex(^(critical|error|warning|information|debug|trace)$)}")]
        public async Task<IActionResult> Get(string id, [FromRoute] string level)
        {
            var app = await _applicationManager.FindByIdAsync(id);
            if (app == null)
            {
                var msg = $"找不到指定的应用程序 {id}";
                _logger.LogWarning(msg);
                return NotFound(new ApiErrorResult<ApiError>(new ApiError(ApiErrorCodes.ObjectNotFound, msg)));
            }

            var result = await _applicationManager.GetEventStatisticsAsync(app, level);
            return Ok(new ApiResult<EventStatisticsResult>(result));
        }

        [HttpPost]
        //[Authorize(Roles = "admin")]
        //[ServiceFilter(typeof(OperationFilterAttribute))]
        public async Task<IActionResult> Post([FromBody] ApplicationPostModel model)
        {
            if (await _applicationManager.Applications.AnyAsync(x => x.Name == model.Name || x.ApplicationId == model.ApplicationId))
            {
                return BadRequest(new ApiErrorResult<ApiError>(new ApiError(ApiErrorCodes.BadArgument, "存在重复的名称或应用程序Id。")));
            }

            var app = new Application
            {
                Id = await _identityGenerator.GenerateAsync(),
                Name = model.Name,
                ApplicationId = model.ApplicationId,
                Description = model.Description,
                Enabled = model.Enabled
            };
            var result = await _applicationManager.CreateApplicationAsync(app);

            if (result.Succeeded)
            {
                return StatusCode(201,
                    new ApiResult<ObjectCreationOutputModel<long>>(new ObjectCreationOutputModel<long>(app.Id,
                        $"{Request.Scheme}://{Request.Host.Value}/api/applications/{app.Id}")));
            }

            var ex = new MyApplicationException();
            ex.SetIdentityErrors(result.Errors);
            throw ex;
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(OperationFilterAttribute))]
        public async Task<IActionResult> Put(string id, [FromBody] ApplicationPostModel model)
        {
            var app = await _applicationManager.FindByIdAsync(id);
            if (app != null)
            {
                app.Name = model.Name;
                app.ApplicationId = model.ApplicationId;
                app.Description = model.Description;
                app.Enabled = model.Enabled;

                var result = await _applicationManager.UpdateAsync(app);

                if (result.Succeeded)
                {
                    return NoContent();
                }

                var ex = new MyApplicationException();
                ex.SetIdentityErrors(result.Errors);
                throw ex;
            }

            var msg = $"找不到指定的应用程序 {id}";
            _logger.LogWarning(msg);
            return NotFound(new ApiErrorResult<ApiError>(new ApiError(ApiErrorCodes.ObjectNotFound, msg)));
        }

        [HttpPatch("{id}")]
        [ServiceFilter(typeof(OperationFilterAttribute))]
        public async Task<IActionResult> Patch(string id, [FromBody] ApplicationPatchSubscribersModel model)
        {
            var app = await _applicationManager.FindByIdAsync(id);
            if (app == null)
            {
                var msg = $"找不到指定的应用程序 {id}";
                _logger.LogWarning(msg);
                return NotFound(new ApiErrorResult<ApiError>(new ApiError(ApiErrorCodes.ObjectNotFound, msg)));
            }

            var result = await _applicationManager.SetSubscribersAsync(app, model.UserList);
            if (result.Succeeded)
            {
                return NoContent();
            }

            var ex = new MyApplicationException();
            ex.SetIdentityErrors(result.Errors);
            throw ex;
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(OperationFilterAttribute))]
        public async Task<IActionResult> Delete(string id)
        {
            var app = await _applicationManager.FindByIdAsync(id);
            if (app != null)
            {
                var result = await _applicationManager.RemoveApplicationAsync(app);
                if (result.Succeeded)
                {
                    return NoContent();
                }

                var ex = new MyApplicationException();
                ex.SetIdentityErrors(result.Errors);
                throw ex;
            }

            return NotFound(new ApiErrorResult<ApiError>(new ApiError(ApiErrorCodes.ObjectNotFound, $"找不到指定的应用程序 {id}")));
        }
    }
}