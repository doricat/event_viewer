using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Viewer.Web.ApiModels;
using Viewer.Web.Controllers.Application;
using Viewer.Web.Data;
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
            IdentityGenerator identityGenerator)
        {
            Logger = logger;
            ApplicationManager = applicationManager;
            IdentityGenerator = identityGenerator;
        }

        public ILogger<ApplicationsController> Logger { get; }

        public ApplicationManager ApplicationManager { get; }

        public IdentityGenerator IdentityGenerator { get; }

        [HttpGet]
        public Task<IActionResult> Get()
        {
            var isAdmin = User.IsInRole("admin");
            var query = isAdmin ? ApplicationManager.Applications : ApplicationManager.Applications.Where(x => x.Enabled);
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
                Logger.LogWarning($"找不到指定的应用程序 {id}");
                return NotFound();
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
        public IActionResult Get(string id, [FromQuery(Name = "$filter")] object filter, [FromQuery(Name = "$top")] int top, [FromQuery(Name = "$skip")] int skip)
        {
            throw new NotImplementedException();
        }

        [HttpGet("{id}/events/summaries/{level}")]
        public IActionResult Get(string id, [FromRoute] string level)
        {
            throw new NotImplementedException();
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Post([FromBody] ApplicationPostModel model)
        {
            var app = new Data.Entities.Application
            {
                Id = await IdentityGenerator.GenerateAsync(),
                Name = model.Name,
                ApplicationId = model.Id,
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
        public async Task<IActionResult> Put(string id, [FromBody] ApplicationPostModel model)
        {
            var app = await ApplicationManager.FindByIdAsync(id);
            if (app != null)
            {
                app.Name = model.Name;
                app.ApplicationId = model.Id;
                app.Description = model.Description;
                app.Enabled = model.Enabled;

                var result = await ApplicationManager.UpdateAsync(app);

                if (result.Succeeded)
                {
                    return NoContent();
                }

                throw new NotImplementedException();
            }

            Logger.LogWarning($"找不到指定的应用程序 {id}");
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
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

            return NoContent();
        }
    }
}