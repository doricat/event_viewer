using System.Threading;
using System.Threading.Tasks;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Data
{
    public interface IApplicationEventStore : IApplicationStore
    {
        Task<EntityResult> AddEventAsync(Application app, Event evt, CancellationToken cancellationToken);

        Task<EntityResult> AddEventAsync(long appId, Event evt, CancellationToken cancellationToken);
    }
}