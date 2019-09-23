using System.Collections.Generic;
using System.Threading.Tasks;

namespace Viewer.Web.Data
{
    public interface IApplicationEventSummaryStore : IApplicationStore
    {
        Task<IDictionary<string, int>> QueryEventSummaryAsync(long appId);
    }
}