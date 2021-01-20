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
                if (_memoryCache.TryGetValue(MonitorSettings.CacheKey, out MonitorSettings settings))
                {
                    if (item.Addition)
                    {
                        settings.AddSetting(item.ConnectionId, item.ApplicationId, item.Level);
                    }
                    else
                    {
                        settings.RemoveSetting(item.ConnectionId, item.ApplicationId, item.Level);
                    }
                }
            }
        }

        private void InitCache()
        {
            _memoryCache.Set(MonitorSettings.CacheKey, new MonitorSettings());
        }
    }
}