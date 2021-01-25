using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Viewer.Web.Data.Entities;
using Viewer.Web.Infrastructure;

namespace Viewer.Web.Services
{
    public class EventStoreBackgroundService : BackgroundService
    {
        private readonly IEventStoreQueue _storeQueue;
        private readonly IEventDbWriter _eventWriter;
        private readonly Queue<Event> _localQueue;
        private readonly IOptions<ApplicationSettings> _options;
        private readonly IEventCleaner _eventCleaner;
        private readonly IHostApplicationLifetime _applicationLifetime;

        public EventStoreBackgroundService(IEventStoreQueue storeQueue,
            IEventDbWriter eventWriter,
            IOptions<ApplicationSettings> options,
            IEventCleaner eventCleaner,
            IHostApplicationLifetime applicationLifetime)
        {
            _storeQueue = storeQueue;
            _eventWriter = eventWriter;
            _options = options;
            _eventCleaner = eventCleaner;
            _applicationLifetime = applicationLifetime;
            _localQueue = new Queue<Event>();
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _applicationLifetime.ApplicationStopping.Register(async () =>
            {
                if (_localQueue.Any())
                {
                    await _eventWriter.WriteAsync(_localQueue.ToArray(), stoppingToken);
                }
            });

            var watch = Stopwatch.StartNew();
            while (!stoppingToken.IsCancellationRequested)
            {
                var evt = await _storeQueue.DequeueAsync(stoppingToken);
                _localQueue.Enqueue(evt);

                if (watch.ElapsedMilliseconds >= _options.Value.EventFlushPeriod * 1000)
                {
                    await _eventWriter.WriteAsync(_localQueue.ToArray(), stoppingToken);
                    _localQueue.Clear();
                    watch.Restart();

                    if (_options.Value.EventStoragePeriod != null)
                    {
                        await _eventCleaner.CleanAsync(evt.ApplicationId, 
                            DateTime.Now.AddDays(-_options.Value.EventStoragePeriod.Value), stoppingToken);
                    }
                }
            }
        }
    }
}