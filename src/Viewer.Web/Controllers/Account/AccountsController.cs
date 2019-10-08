using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Viewer.Web.ApiModels;
using Viewer.Web.Controllers.Account;
using Viewer.Web.Data;
using Viewer.Web.Data.Entities;
using Viewer.Web.Utilities;

namespace Viewer.Web.Controllers
{
    [Route("api/accounts")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        public AccountsController(ILogger<AccountsController> logger,
            UserManager<User> userManager,
            IdentityGenerator identityGenerator,
            RoleManager<Role> roleManager,
            FileManager fileManager,
            IOptionsMonitor<PrimarySettings> primarySettings,
            IdentityErrorDescriber errorDescriber)
        {
            Logger = logger;
            UserManager = userManager;
            IdentityGenerator = identityGenerator;
            RoleManager = roleManager;
            FileManager = fileManager;
            ErrorDescriber = errorDescriber;
            PrimarySettings = primarySettings.CurrentValue;
        }

        public ILogger<AccountsController> Logger { get; }

        public UserManager<User> UserManager { get; }

        public IdentityGenerator IdentityGenerator { get; }

        public RoleManager<Role> RoleManager { get; }

        public FileManager FileManager { get; }

        public PrimarySettings PrimarySettings { get; }

        public IdentityErrorDescriber ErrorDescriber { get; }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Gets()
        {
            var users = await UserManager.Users.ToListAsync(HttpContext.RequestAborted);

            return Ok(new ApiResult<IList<AccountGetOutputModel>>(users.Select(x => new AccountGetOutputModel
            {
                Id = x.Id,
                Email = x.Email,
                Name = x.Name,
                Avatar = x.Avatar
            }).ToList()));
        }

        [Authorize]
        [HttpGet("current/profiles")]
        public async Task<IActionResult> Get()
        {
            var user = await UserManager.FindByEmailAsync(User.Identity.Name);
            return Ok(new ApiResult<UserProfilesOutputModel>(new UserProfilesOutputModel
            {
                Name = user.Name,
                Avatar = user.Avatar
            }));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AccountPostModel model)
        {
            var id = await IdentityGenerator.GenerateAsync();
            var result = await UserManager.CreateAsync(new User
            {
                Id = id,
                Email = model.Email,
                UserName = model.Email,
                Name = model.Name,
                Avatar = PrimarySettings.DefaultAvatar
            }, model.Password);

            if (result.Succeeded)
            {
                Logger.LogInformation("账户创建成功");
                return StatusCode(201, new ApiResult<ObjectCreationOutputModel<long>>(new ObjectCreationOutputModel<long>(id,
                    $"{Request.Scheme}://{Request.Host.Value}/api/accounts/{id}")));
            }

            return BadRequest();
        }

        [Authorize]
        [HttpPatch("current/profiles/avatar")]
        public async Task<IActionResult> Patch([FromForm] UserPatchAvatarInputModel model)
        {
            var user = await UserManager.FindByEmailAsync(User.Identity.Name);

            using (var stream = new MemoryStream())
            {
                await model.File.CopyToAsync(stream);
                var id = await FileManager.CreateFileAsync(stream, model.File.ContentType, model.File.FileName);

                var location = $"/api/images/{id}";
                user.Avatar = location;
                await UserManager.UpdateAsync(user);

                return NoContent();
            }
        }

        [Authorize]
        [HttpPatch("current/profiles/name")]
        public async Task<IActionResult> Patch([FromBody] UserNameInputModel model)
        {
            var user = await UserManager.FindByEmailAsync(User.Identity.Name);
            user.Name = model.Name;
            await UserManager.UpdateAsync(user);

            return NoContent();
        }

        [Authorize]
        [HttpPatch("current/password")]
        public async Task<IActionResult> Patch([FromBody] AccountPasswordPatchModel model)
        {
            var user = await UserManager.FindByEmailAsync(User.Identity.Name);
            var result = await UserManager.ChangePasswordAsync(user, model.CurrentPassword, model.Password);
            if (result.Succeeded)
            {
                return NoContent();
            }

            if (result.Errors.FirstOrDefault(x => x.Code == ErrorDescriber.PasswordMismatch().Code) != null)
            {
                return BadRequest(new ApiErrorResult<ApiError>(new ApiError(ApiErrorCodes.BadArgument, "当前密码验证失败。")));
            }

            throw new NotImplementedException();
        }

        [Authorize]
        [HttpDelete("current/profiles/avatar")]
        public async Task<IActionResult> Delete()
        {
            var user = await UserManager.FindByEmailAsync(User.Identity.Name);
            user.Avatar = PrimarySettings.DefaultAvatar;
            var result = await UserManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                return NoContent();
            }

            throw new NotImplementedException();
        }
    }
}