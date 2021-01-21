using System.Threading;
using System.Threading.Tasks;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Data
{
    public interface IApplicationEventQueries
    {
        Task<EventStatisticsResult> CountEventAsync(Application app, string level, CancellationToken cancellationToken);
    }
}