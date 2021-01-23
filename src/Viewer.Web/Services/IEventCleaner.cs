using System;
using System.Threading;
using System.Threading.Tasks;

namespace Viewer.Web.Services
{
    public interface IEventCleaner
    {
        Task CleanAsync(long appId, DateTime? startTime, DateTime? endTime, CancellationToken cancellationToken);
    }
}