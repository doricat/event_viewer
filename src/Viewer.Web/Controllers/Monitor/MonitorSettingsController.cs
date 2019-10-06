using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Viewer.Web.Controllers.Monitor;

namespace Viewer.Web.Controllers
{
    [Route("api/monitor_settings")]
    [ApiController]
    [Authorize]
    public class MonitorSettingsController : ControllerBase
    {
        public MonitorSettingsController(ILogger<MonitorSettingsController> logger, IMemoryCache memoryCache)
        {
            Logger = logger;
            MemoryCache = memoryCache;
        }

        public ILogger<MonitorSettingsController> Logger { get; }

        public IMemoryCache MemoryCache { get; }

        [HttpPatch("{id}")]
        public IActionResult Patch(string id /*signalR connection id*/, [FromBody] MonitorSettingsPutModel model)
        {
            Logger.LogDebug(model.ToString());

            if (MemoryCache.TryGetValue(id, out MonitorSettings settings))
            {
                if (settings.AppId == 0)
                {
                    settings.AppId = model.AppId;
                }

                MemoryCache.Remove(id);
            }
            else
            {
                settings = new MonitorSettings {AppId = model.AppId};
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

            MemoryCache.Set(id, settings);
            return NoContent();
        }
    }
}