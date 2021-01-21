using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Services
{
    public class EventStoreQueue : IEventStoreQueue
    {
        private readonly SemaphoreSlim _signal = new SemaphoreSlim(0);
        private readonly ConcurrentQueue<Event> _queue = new ConcurrentQueue<Event>();

        public void Enqueue(Event data)
        {
            _queue.Enqueue(data);
            _signal.Release();
        }

        public async Task<Event> DequeueAsync(CancellationToken cancellationToken)
        {
            await _signal.WaitAsync(cancellationToken);
            _queue.TryDequeue(out var data);

            return data;
        }
    }
}