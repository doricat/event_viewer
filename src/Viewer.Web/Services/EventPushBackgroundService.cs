using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Viewer.Web.Data.Entities;
using Viewer.Web.Extensions;
using Viewer.Web.Hubs;
using Viewer.Web.Infrastructure;
using Viewer.Web.Utilities;

namespace Viewer.Web.Services
{
    public class EventPushBackgroundService : BackgroundService
    {
        private readonly IEventQueue _eventQueue;
        private readonly IEventStoreQueue _storeQueue;
        private readonly IHubContext<EventHub, IEventClient> _hubContext;
        private readonly IdentityGenerator _identityGenerator;
        private readonly IOptions<ApplicationSettings> _options;

        public EventPushBackgroundService(IEventQueue eventQueue, 
            IHubContext<EventHub, IEventClient> hubContext, 
            IdentityGenerator identityGenerator, 
            IOptions<ApplicationSettings> options, 
            IEventStoreQueue storeQueue)
        {
            _eventQueue = eventQueue;
            _hubContext = hubContext;
            _identityGenerator = identityGenerator;
            _options = options;
            _storeQueue = storeQueue;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var options = _options.Value;
            while (!stoppingToken.IsCancellationRequested)
            {
                var item = await _eventQueue.DequeueAsync(stoppingToken);
                var applicationId = item.ApplicationId ?? options.CurrentApplicationId;
                var id = await _identityGenerator.GenerateAsync();
                await _hubContext.Clients.Group(applicationId.ToString()).ReceiveMessage(new EventViewModel
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