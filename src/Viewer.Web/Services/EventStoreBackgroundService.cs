using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Viewer.Web.Data.Entities;
using Viewer.Web.Hubs;
using Viewer.Web.Utilities;

namespace Viewer.Web.Services
{
    public class EventStoreBackgroundService : BackgroundService
    {
        public EventStoreBackgroundService(ILogger<EventStoreBackgroundService> logger,
            IEventStoreQueue storeQueue,
            IHubContext<EventHub> context,
            EventWriter eventWriter,
            IdentityGenerator identityGenerator,
            IOptionsMonitor<EventWriterOptions> options, IMemoryCache memoryCache)
        {
            Logger = logger;
            StoreQueue = storeQueue;
            Context = context;
            EventWriter = eventWriter;
            IdentityGenerator = identityGenerator;
            MemoryCache = memoryCache;
            Options = options.CurrentValue;
        }

        public ILogger<EventStoreBackgroundService> Logger { get; }

        public IEventStoreQueue StoreQueue { get; }

        public IHubContext<EventHub> Context { get; }

        public EventWriter EventWriter { get; }

        public IdentityGenerator IdentityGenerator { get; }

        public EventWriterOptions Options { get; }

        public IMemoryCache MemoryCache { get; }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var item = await StoreQueue.DequeueAsync(stoppingToken);

                var id = await IdentityGenerator.GenerateAsync();
                var evt = new Event
                {
                    Id = id,
                    GlobalId = id,
                    ApplicationId = Options.CurrentApplicationId,
                    Category = item.Category,
                    Level = item.Level,
                    EventId = item.EventId,
                    EventType = item.EventType,
                    Message = item.Message,
                    Exception = JsonConvert.SerializeObject(item.Exception, new JsonSerializerSettings {ReferenceLoopHandling = ReferenceLoopHandling.Ignore}),
                    ProcessId = item.ProcessId,
                    TimeStamp = item.Timestamp
                };

                try
                {
                    await EventWriter.WriteAsync(evt, stoppingToken);
                    await Context.Clients.Group(Options.CurrentApplicationId.ToString()).SendAsync("ReceiveMessage", new EventViewModel
                    {
                        Id = id,
                        Level = item.Level,
                        Category = item.Category,
                        Message = item.Message,
                        AppId = evt.ApplicationId,
                        EventId = item.EventId,
                        EventType = item.EventType,
                        Timestamp = item.Timestamp
                    }, stoppingToken);
                }
                catch (Exception ex)
                {
                    // TODO 不可在日志组件内使用日志功能 会导致循环日志
                    File.WriteAllText(Path.Combine(Directory.GetCurrentDirectory(), $"{DateTime.Now.Ticks}.ex.log"),
                        JsonConvert.SerializeObject(ex, new JsonSerializerSettings
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        }));
                }
            }
        }
    }
}