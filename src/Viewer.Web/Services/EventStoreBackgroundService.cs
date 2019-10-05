using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Viewer.Web.Hubs;

namespace Viewer.Web.Services
{
    public class EventStoreBackgroundService : BackgroundService
    {
        public EventStoreBackgroundService(ILogger<EventStoreBackgroundService> logger,
            IEventStoreQueue storeQueue,
            IHubContext<EventHub> context, 
            EventWriter eventWriter)
        {
            Logger = logger;
            StoreQueue = storeQueue;
            Context = context;
            EventWriter = eventWriter;
        }

        public ILogger<EventStoreBackgroundService> Logger { get; }

        public IEventStoreQueue StoreQueue { get; }

        public IHubContext<EventHub> Context { get; }

        public EventWriter EventWriter { get; }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var evt = await StoreQueue.DequeueAsync(stoppingToken);

                try
                {
                    await EventWriter.WriteAsync(evt, stoppingToken);
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