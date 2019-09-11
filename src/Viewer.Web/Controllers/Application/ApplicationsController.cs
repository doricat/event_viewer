using System;
using Microsoft.AspNetCore.Mvc;

namespace Viewer.Web.Controllers
{
    [Route("api/applications")]
    [ApiController]
    public class ApplicationsController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            throw new NotImplementedException();
        }

        [HttpGet("{id}")]
        public IActionResult Get(string id)
        {
            throw new NotImplementedException();
        }

        [HttpGet("{id}/events")]
        public IActionResult Get(string id, [FromQuery(Name = "$filter")] object filter, [FromQuery(Name = "$top")] int top, [FromQuery(Name = "$skip")] int skip)
        {
            throw new NotImplementedException();
        }

        [HttpGet("{id}/events/summaries/{level}")]
        public IActionResult Get(string id, string level)
        {
            throw new NotImplementedException();
        }

        [HttpPost]
        public IActionResult Post()
        {
            throw new NotImplementedException();
        }

        [HttpPut("{id}")]
        public IActionResult Put(string id)
        {
            throw new NotImplementedException();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            throw new NotImplementedException();
        }
    }
}