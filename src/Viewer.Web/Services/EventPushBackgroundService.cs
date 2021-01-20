using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Viewer.Web.Data.Entities;
using Viewer.Web.Extensions;
using Viewer.Web.Hubs;
using Viewer.Web.Infrastructure;
using Viewer.Web.Utilities;
using Viewer.Web.ViewModels.Monitor;

namespace Viewer.Web.Services
{
    public class EventPushBackgroundService : BackgroundService
    {
        private readonly IEventQueue _eventQueue;
        private readonly IEventStoreQueue _storeQueue;
        private readonly IHubContext<EventHub, IEventClient> _hubContext;
        private readonly IdentityGenerator _identityGenerator;
        private readonly IOptions<ApplicationSettings> _options;
        private readonly IMemoryCache _memoryCache;

        public EventPushBackgroundService(IEventQueue eventQueue, 
            IHubContext<EventHub, IEventClient> hubContext, 
            IdentityGenerator identityGenerator, 
            IOptions<ApplicationSettings> options, 
            IEventStoreQueue storeQueue, 
            IMemoryCache memoryCache)
        {
            _eventQueue = eventQueue;
            _hubContext = hubContext;
            _identityGenerator = identityGenerator;
            _options = options;
            _storeQueue = storeQueue;
            _memoryCache = memoryCache;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var options = _options.Value;
            while (!stoppingToken.IsCancellationRequested)
            {
                var item = await _eventQueue.DequeueAsync(stoppingToken);
                var applicationId = item.ApplicationId ?? options.CurrentApplicationId;
                var id = await _identityGenerator.GenerateAsync();

                if (_memoryCache.TryGetValue(MonitorSettings.CacheKey, out MonitorSettings settings))
                {
                    if (settings.ShouldPush(item.Level, out var connections))
                    {
                        await _hubContext.Clients.Clients(connections.ToList()).ReceiveEvent(new EventViewModel
                        {
                            Id = id,
                            Level = item.Level,
                            Category = item.Category,
                            Message = item.Message,
                            ApplicationId = applicationId,
                            EventId = item.EventId,
                            EventType = item.EventType,
                            Timestamp = item.Timestamp
                        });
                    }
                }

                var evt = new Event
                {
                    Id = id,
                    GlobalId = id,
                    ApplicationId = applicationId,
                    Category = item.Category,
                    Level = item.Level,
                    EventId = item.EventId,
                    EventType = item.EventType,
                    Message = item.Message,
                    Exception = item.Exception.SerializeToJson(),
                    ProcessId = item.ProcessId,
                    TimeStamp = item.Timestamp
                };

                _storeQueue.Enqueue(evt);
            }
        }
    }
}