using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;

namespace Viewer.Web.Services
{
    public class EventCleaningQueue : IEventCleaningQueue
    {
        private readonly SemaphoreSlim _signal = new SemaphoreSlim(0);
        private readonly ConcurrentQueue<long> _queue = new ConcurrentQueue<long>();

        public void Enqueue(long data)
        {
            _queue.Enqueue(data);
            _signal.Release();
        }

        public async Task<long> DequeueAsync(CancellationToken cancellationToken)
        {
            await _signal.WaitAsync(cancellationToken);
            _queue.TryDequeue(out var workItem);

            return workItem;
        }
    }
}