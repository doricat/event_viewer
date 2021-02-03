using System;
using System.Threading;
using System.Threading.Tasks;

namespace Viewer.Web.Services
{
    public interface IEventCleaner
    {
        Task CleanAsync(long applicationId, DateTime? endTime, CancellationToken cancellationToken);
    }
}