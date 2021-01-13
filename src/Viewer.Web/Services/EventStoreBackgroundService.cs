using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Viewer.Web.Data.Entities;
using Viewer.Web.Hubs;
using Viewer.Web.Utilities;

namespace Viewer.Web.Services
{
    public class EventStoreBackgroundService : BackgroundService
    {
        private readonly IEventStoreQueue _storeQueue;
        private readonly IHubContext<EventHub, IEventClient> _hubContext;
        private readonly IEventDbWriter _eventWriter;
        private readonly IdentityGenerator _identityGenerator;
        private readonly IOptions<ApplicationSettings> _options;

        public EventStoreBackgroundService(IEventStoreQueue storeQueue,
            IHubContext<EventHub, IEventClient> context,
            IEventDbWriter eventWriter,
            IdentityGenerator identityGenerator,
            IOptions<ApplicationSettings> options)
        {
            _storeQueue = storeQueue;
            _hubContext = context;
            _eventWriter = eventWriter;
            _identityGenerator = identityGenerator;
            _options = options;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var options = _options.Value;
            while (!stoppingToken.IsCancellationRequested)
            {
                var item = await _storeQueue.DequeueAsync(stoppingToken);

                var appId = item.ApplicationId ?? options.CurrentApplicationId;

                var id = await _identityGenerator.GenerateAsync();
                var evt = new Event
                {
                    Id = id,
                    GlobalId = id,
                    ApplicationId = appId,
                    Category = item.Category,
                    Level = item.Level,
                    EventId = item.EventId,
                    EventType = item.EventType,
                    Message = item.Message,
                    Exception = JsonConvert.SerializeObject(item.Exception, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore }),
                    ProcessId = item.ProcessId,
                    TimeStamp = item.Timestamp
                };

                try
                {
                    await _eventWriter.WriteAsync(evt, stoppingToken);

                    await _hubContext.Clients.Group(appId.ToString()).ReceiveMessage(new EventViewModel
                    {
                        Id = id,
                        Level = item.Level,
                        Category = item.Category,
                        Message = item.Message,
                        AppId = evt.ApplicationId,
                        EventId = item.EventId,
                        EventType = item.EventType,
                        Timestamp = item.Timestamp
                    });
                }
                catch (Exception ex)
                {
                    // TODO
                }
            }
        }
    }
}