using System;
using Microsoft.AspNetCore.Mvc;

namespace Viewer.Web.Controllers
{
    [Route("api/events")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        [HttpGet("{id}")]
        public IActionResult Get(long id)
        {
            throw new NotImplementedException();
        }
    }
}