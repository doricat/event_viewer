using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Hosting;
using Viewer.Web.ViewModels.Monitor;

namespace Viewer.Web.Services
{
    public class MonitorSettingsBackgroundService : BackgroundService
    {
        private readonly IMonitorSettingsUpdatingQueue _monitorSettingsUpdatingQueue;
        private readonly IMemoryCache _memoryCache;

        public MonitorSettingsBackgroundService(IMonitorSettingsUpdatingQueue monitorSettingsUpdatingQueue, 
            IMemoryCache memoryCache)
        {
            _monitorSettingsUpdatingQueue = monitorSettingsUpdatingQueue;
            _memoryCache = memoryCache;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            InitCache();

            while (!stoppingToken.IsCancellationRequested)
            {
                var item = await _monitorSettingsUpdatingQueue.DequeueAsync(stoppingToken);
                var levels = item.Level == null
                    ? new List<string> {"critical", "error", "warning", "information", "debug", "trace"}
                    : new List<string> {item.Level};

                foreach (var level in levels)
                {
                    if (_memoryCache.TryGetValue(MonitorSettings.GetCacheKey(level), out MonitorSettings settings))
                    {
                        if (item.Addition)
                        {
                            settings.AddConnection(item.ApplicationId, item.ConnectionId);
                        }
                        else
                        {
                            settings.RemoveConnection(item.ApplicationId, item.ConnectionId);
                        }
                    }
                }
            }
        }

        private void InitCache()
        {
            _memoryCache.Set(MonitorSettings.GetCacheKey("critical"), new MonitorSettings());
            _memoryCache.Set(MonitorSettings.GetCacheKey("error"), new MonitorSettings());
            _memoryCache.Set(MonitorSettings.GetCacheKey("warning"), new MonitorSettings());
            _memoryCache.Set(MonitorSettings.GetCacheKey("information"), new MonitorSettings());
            _memoryCache.Set(MonitorSettings.GetCacheKey("debug"), new MonitorSettings());
            _memoryCache.Set(MonitorSettings.GetCacheKey("trace"), new MonitorSettings());
        }
    }
}