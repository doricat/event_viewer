using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Viewer.Web.Data.Entities;
using Viewer.Web.ViewModels.Account;
using WebApi.Models;

namespace Viewer.Web.Controllers
{
    [Route("api/users")]
    [ApiController]
    [Authorize(Roles = "admin")]
    public class UsersController : ControllerBase
    {
        private readonly ILogger<AccountsController> _logger;
        private readonly UserManager<User> _userManager;

        public UsersController(ILogger<AccountsController> logger,
            UserManager<User> userManager)
        {
            _logger = logger;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var users = await _userManager.Users.ToListAsync(HttpContext.RequestAborted);
            return Ok(new ApiResult<IList<AccountGetOutputModel>>(users.Select(AccountGetOutputModel.FromUser).ToList()));
        }
    }
}