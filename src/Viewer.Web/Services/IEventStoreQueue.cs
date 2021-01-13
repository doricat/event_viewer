using System.Threading;
using System.Threading.Tasks;
using Viewer.Web.Extensions.Logging;

namespace Viewer.Web.Services
{
    public interface IEventStoreQueue
    {
        void QueueBackgroundWorkItem(LogMessage item);

        Task<LogMessage> DequeueAsync(CancellationToken cancellationToken);
    }
}