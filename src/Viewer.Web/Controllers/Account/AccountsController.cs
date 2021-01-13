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
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Processing;
using Viewer.Web.ApiModels;
using Viewer.Web.Controllers.Account;
using Viewer.Web.Data;
using Viewer.Web.Data.Entities;
using Viewer.Web.Extensions;
using WebApi.Models;

namespace Viewer.Web.Controllers
{
    [Route("api/accounts")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly ILogger<AccountsController> _logger;
        private readonly UserManager<User> _userManager;
        private readonly FileManager _fileManager;
        private readonly IOptionsMonitor<ApplicationSettings> _applicationSettings;
        private readonly IdentityErrorDescriber _errorDescriber;

        public AccountsController(ILogger<AccountsController> logger,
            UserManager<User> userManager,
            FileManager fileManager,
            IOptionsMonitor<ApplicationSettings> applicationSettings,
            IdentityErrorDescriber errorDescriber)
        {
            _logger = logger;
            _userManager = userManager;
            _fileManager = fileManager;
            _errorDescriber = errorDescriber;
            _applicationSettings = applicationSettings;
        }


        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Gets()
        {
            var users = await _userManager.Users.ToListAsync(HttpContext.RequestAborted);
            return Ok(new ApiResult<IList<AccountGetOutputModel>>(users.Select(AccountGetOutputModel.FromUser).ToList()));
        }

        [Authorize]
        [HttpGet("{id}/profiles")]
        public async Task<IActionResult> Get([FromRoute] string id)
        {
            var user = await _userManager.FindByEmailAsync(User.Identity.Name);
            return Ok(new ApiResult<UserProfilesOutputModel>(UserProfilesOutputModel.FromUser(user)));
        }

        [Authorize]
        [HttpPatch("{id}/profiles/avatar")]
        [ServiceFilter(typeof(OperationFilterAttribute))]
        public async Task<IActionResult> Patch([FromRoute] string id, [FromForm] UserPatchAvatarInputModel model)
        {
            var user = await _userManager.FindByEmailAsync(User.Identity.Name);

            using (var stream = new MemoryStream())
            {
                await model.File.CopyToAsync(stream);
                using (var imageStream = new MemoryStream())
                {
                    // 将文件剪裁为180 * 180 px
                    const int px = 180;
                    stream.Seek(0, SeekOrigin.Begin);
                    using (var image = Image.Load(stream))
                    {
                        if (image.Width < image.Height)
                        {
                            var times = (decimal)image.Height / image.Width;
                            image.Mutate(x => x.Resize(px, (int)(px * times)));
                        }
                        else
                        {
                            var times = (decimal)image.Width / image.Height;
                            image.Mutate(x => x.Resize((int)(px * times), px));
                        }

                        image.Mutate(x => x.Crop(new Rectangle(0, 0, px, px)));

                        switch (model.File.ContentType.ToLower())
                        {
                            case "image/jpeg":
                            case "image/jpg":
                                image.Save(imageStream, new JpegEncoder());
                                break;

                            case "image/png":
                                image.Save(imageStream, new PngEncoder());
                                break;

                            default:
                                throw new ArgumentOutOfRangeException();
                        }
                    }

                    var fileId = await _fileManager.CreateFileAsync(imageStream, model.File.ContentType, model.File.FileName);

                    user.AvatarId = fileId;
                    await _userManager.UpdateAsync(user);
                }

                return Ok(new ApiResult<string>($"/api/files/{user.AvatarId}"));
            }
        }

        [Authorize]
        [HttpPatch("{id}/profiles/name")]
        [ServiceFilter(typeof(OperationFilterAttribute))]
        public async Task<IActionResult> Patch([FromRoute] string id, [FromBody] UserNameInputModel model)
        {
            var user = await _userManager.FindByEmailAsync(User.Identity.Name);
            user.Name = model.Name;
            await _userManager.UpdateAsync(user);

            return NoContent();
        }

        [Authorize]
        [HttpPatch("{id}/password")]
        [ServiceFilter(typeof(OperationFilterAttribute))]
        public async Task<IActionResult> Patch([FromRoute] string id, [FromBody] AccountPasswordPatchModel model)
        {
            var user = await _userManager.FindByEmailAsync(User.Identity.Name);
            var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.Password);
            if (result.Succeeded)
            {
                return NoContent();
            }

            if (result.Errors.FirstOrDefault(x => x.Code == _errorDescriber.PasswordMismatch().Code) != null)
            {
                return BadRequest(new ApiErrorResult<ApiError>(new ApiError(ApiErrorCodes.BadArgument, "当前密码验证失败。")));
            }

            var ex = new MyApplicationException();
            ex.SetIdentityErrors(result.Errors);
            throw ex;
        }

        [Authorize]
        [HttpDelete("{id}/profiles/avatar")]
        [ServiceFilter(typeof(OperationFilterAttribute))]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            var user = await _userManager.FindByEmailAsync(User.Identity.Name);
            user.AvatarId = _applicationSettings.CurrentValue.DefaultAvatar;
            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                return Ok(new ApiResult<string>($"/api/files/{user.AvatarId}"));
            }

            var ex = new MyApplicationException();
            ex.SetIdentityErrors(result.Errors);
            throw ex;
        }
    }
}