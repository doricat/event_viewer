using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Viewer.Web.ApiModels;
using Viewer.Web.Controllers.Token;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Controllers
{
    [Route("api/tokens")]
    [ApiController]
    public class TokensController : ControllerBase
    {
        public TokensController(ILogger<TokensController> logger,
            IOptionsMonitor<SecretOptions> secretOptions,
            UserManager<User> userManager,
            SignInManager<User> signInManager)
        {
            Logger = logger;
            UserManager = userManager;
            SignInManager = signInManager;
            SecretOptions = secretOptions.CurrentValue;
        }

        public ILogger<TokensController> Logger { get; }

        public SecretOptions SecretOptions { get; }

        public UserManager<User> UserManager { get; }

        public SignInManager<User> SignInManager { get; }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] TokenRequestModel model)
        {
            await HttpContext.SignOutAsync();

            var result = await SignInManager.PasswordSignInAsync(model.Username, model.Password, false, true);
            if (result.Succeeded)
            {
                var claimsPrincipal = await SignInManager.CreateUserPrincipalAsync(await UserManager.FindByEmailAsync(model.Username));
                var token = CreateToken(claimsPrincipal.Identity);
                return Ok(new ApiResult<string>(token));
            }

            return BadRequest(new ApiError(ApiErrorCodes.BadArgument, "用户名或密码错误"));
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult Get()
        {
            return Ok(User.Claims);
        }

        private string CreateToken(IIdentity identity)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(SecretOptions.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(identity),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwt = tokenHandler.WriteToken(token);

            return jwt;
        }
    }
}