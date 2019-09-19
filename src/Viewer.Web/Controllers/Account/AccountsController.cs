using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Viewer.Web.ApiModels;
using Viewer.Web.Controllers.Account;
using Viewer.Web.Data.Entities;
using Viewer.Web.Utilities;

namespace Viewer.Web.Controllers
{
    [Route("api/accounts")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        public AccountsController(ILogger<AccountsController> logger, UserManager<User> userManager, IdentityGenerator identityGenerator, RoleManager<Role> roleManager)
        {
            Logger = logger;
            UserManager = userManager;
            IdentityGenerator = identityGenerator;
            RoleManager = roleManager;
        }

        public ILogger<AccountsController> Logger { get; }

        public UserManager<User> UserManager { get; }

        public IdentityGenerator IdentityGenerator { get; }

        public RoleManager<Role> RoleManager { get; }

        [HttpGet("{id}")]
        public IActionResult Get(string id)
        {
            throw new NotImplementedException();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AccountPostModel model)
        {
            var id = await IdentityGenerator.GenerateAsync();
            var result = await UserManager.CreateAsync(new User
            {
                Id = id,
                Email = model.Email
            }, model.Password);

            if (result.Succeeded)
            {
                Logger.LogInformation("账户创建成功");
                return StatusCode(201, new ApiResult<ObjectCreationOutputModel<long>>(new ObjectCreationOutputModel<long>(id,
                    $"{Request.Scheme}://{Request.Host.Value}/api/accounts/{id}")));
            }

            return BadRequest();
        }
    }
}