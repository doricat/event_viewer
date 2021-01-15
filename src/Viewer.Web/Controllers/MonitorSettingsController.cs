using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Viewer.Web.ViewModels.Monitor;

namespace Viewer.Web.Controllers
{
    [Route("api/monitor_settings")]
    [ApiController]
    [Authorize]
    public class MonitorSettingsController : ControllerBase
    {
        private readonly ILogger<MonitorSettingsController> _logger;
        private readonly IMemoryCache _memoryCache;

        public MonitorSettingsController(ILogger<MonitorSettingsController> logger, IMemoryCache memoryCache)
        {
            _logger = logger;
            _memoryCache = memoryCache;
        }


        [HttpPatch("{id}")]
        public IActionResult Patch(string id /*signalR connection id*/, [FromBody] MonitorSettingsPutModel model)
        {
            _logger.LogDebug(model.ToString());

            if (_memoryCache.TryGetValue(id, out MonitorSettings settings))
            {
                if (settings.ApplicationId == 0)
                {
                    settings.ApplicationId = model.ApplicationId;
                }

                _memoryCache.Remove(id);
            }
            else
            {
                settings = new MonitorSettings { ApplicationId = model.ApplicationId };
            }

            if (model.Level.StartsWith('-'))
            {
                var level = model.Level.Substring(1);
                if (settings.Levels.Contains(level))
                {
                    settings.Levels.Remove(level);
                }
            }
            else
            {
                if (!settings.Levels.Contains(model.Level))
                {
                    settings.Levels.Add(model.Level);
                }
            }

            _memoryCache.Set(id, settings);
            return NoContent();
        }
    }
}