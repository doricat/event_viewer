using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using Logging;

namespace Viewer.Web.Services
{
    public class EventStoreQueue : IEventStoreQueue
    {
        private readonly SemaphoreSlim _signal = new SemaphoreSlim(0);
        private readonly ConcurrentQueue<LogMessage> _workItems = new ConcurrentQueue<LogMessage>();

        public void QueueBackgroundWorkItem(LogMessage item)
        {
            _workItems.Enqueue(item);
            _signal.Release();
        }

        public async Task<LogMessage> DequeueAsync(CancellationToken cancellationToken)
        {
            await _signal.WaitAsync(cancellationToken);
            _workItems.TryDequeue(out var workItem);

            return workItem;
        }
    }
}