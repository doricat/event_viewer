using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;

namespace Viewer.Web.Services
{
    public class MonitorSettingsUpdatingQueue : IMonitorSettingsUpdatingQueue
    {
        private readonly SemaphoreSlim _signal = new SemaphoreSlim(0);
        private readonly ConcurrentQueue<MonitorSettingDto> _queue = new ConcurrentQueue<MonitorSettingDto>();

        public void Enqueue(MonitorSettingDto data)
        {
            _queue.Enqueue(data);
            _signal.Release();
        }

        public async Task<MonitorSettingDto> DequeueAsync(CancellationToken cancellationToken)
        {
            await _signal.WaitAsync(cancellationToken);
            _queue.TryDequeue(out var data);

            return data;
        }
    }
}