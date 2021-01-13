using System.Threading;
using System.Threading.Tasks;
using Viewer.Web.Data;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Services
{
    public interface IEventDbWriter
    {
        Task<EntityResult> WriteAsync(Event evt, CancellationToken cancellationToken);
    }
}