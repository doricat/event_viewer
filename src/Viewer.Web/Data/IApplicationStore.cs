using System.Threading;
using System.Threading.Tasks;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Data
{
    public interface IApplicationStore
    {
        Task<Application> FindByNameAsync(string name);

        Task<Application> FindByIdAsync(string id);

        Task<EntityResult> DeleteAsync(Application app, CancellationToken cancellationToken);

        Task<EntityResult> UpdateAsync(Application app, CancellationToken cancellationToken);

        Task<EntityResult> CreateAsync(Application app, CancellationToken cancellationToken);
    }
}