using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Services
{
    public class EventStoreBackgroundService : BackgroundService
    {
        private readonly IEventStoreQueue _storeQueue;
        private readonly IEventDbWriter _eventWriter;
        private readonly Queue<Event> _localQueue;
        private readonly IOptions<ApplicationSettings> _options;

        public EventStoreBackgroundService(IEventStoreQueue storeQueue,
            IEventDbWriter eventWriter, 
            Queue<Event> localQueue, 
            IOptions<ApplicationSettings> options)
        {
            _storeQueue = storeQueue;
            _eventWriter = eventWriter;
            _localQueue = localQueue;
            _options = options;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var watch = Stopwatch.StartNew();
            while (!stoppingToken.IsCancellationRequested)
            {
                var evt = await _storeQueue.DequeueAsync(stoppingToken);
                _localQueue.Enqueue(evt);

                if (watch.ElapsedMilliseconds >= _options.Value.EventFlushPeriod * 1000)
                {
                    await _eventWriter.WriteAsync(_localQueue.ToArray(), stoppingToken);
                    _localQueue.Clear();
                    watch.Reset();
                }
            }
        }
    }
}