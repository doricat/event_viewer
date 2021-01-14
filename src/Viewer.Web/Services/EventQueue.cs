using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using Viewer.Web.Extensions.Logging;

namespace Viewer.Web.Services
{
    public class EventQueue : IEventQueue
    {
        private readonly SemaphoreSlim _signal = new SemaphoreSlim(0);
        private readonly ConcurrentQueue<LogMessage> _queue = new ConcurrentQueue<LogMessage>();

        public void Enqueue(LogMessage data)
        {
            _queue.Enqueue(data);
            _signal.Release();
        }

        public async Task<LogMessage> DequeueAsync(CancellationToken cancellationToken)
        {
            await _signal.WaitAsync(cancellationToken);
            _queue.TryDequeue(out var data);

            return data;
        }
    }
}