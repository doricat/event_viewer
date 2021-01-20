using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Viewer.Web.Services;
using Viewer.Web.ViewModels.Monitor;

namespace Viewer.Web.Controllers
{
    [Route("api/monitor_settings")]
    [ApiController]
    [Authorize]
    public class MonitorSettingsController : ControllerBase
    {
        private readonly ILogger<MonitorSettingsController> _logger;
        private readonly IMonitorSettingsUpdatingQueue _monitorSettingsUpdatingQueue;

        public MonitorSettingsController(ILogger<MonitorSettingsController> logger, 
            IMonitorSettingsUpdatingQueue monitorSettingsUpdatingQueue)
        {
            _logger = logger;
            _monitorSettingsUpdatingQueue = monitorSettingsUpdatingQueue;
        }

        [HttpPatch("{id}")]
        public IActionResult Patch(string id /*signalR connection id*/, [FromBody] MonitorSettingsPutModel model)
        {
            _logger.LogDebug(model.ToString());

            if (model.Level.StartsWith('-'))
            {
                var level = model.Level[1..];
                _monitorSettingsUpdatingQueue.Enqueue(MonitorSettingDto.Remove(model.ApplicationId, id, level));
            }
            else
            {
                _monitorSettingsUpdatingQueue.Enqueue(MonitorSettingDto.Add(model.ApplicationId, id, model.Level));
            }

            return NoContent();
        }
    }
}