using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;

namespace Viewer.Web.Services
{
    public class EventCleaningBackgroundService : BackgroundService
    {
        private readonly IEventCleaner _eventCleaner;
        private readonly IEventCleaningQueue _cleaningQueue;

        public EventCleaningBackgroundService(IEventCleaner eventCleaner, 
            IEventCleaningQueue cleaningQueue)
        {
            _eventCleaner = eventCleaner;
            _cleaningQueue = cleaningQueue;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var appId = await _cleaningQueue.DequeueAsync(stoppingToken);
                var startTime = DateTime.Now.AddDays(-7);
                await _eventCleaner.CleanAsync(appId, startTime, null, stoppingToken);
            }
        }
    }
}