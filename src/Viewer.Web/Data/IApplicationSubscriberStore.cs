using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Data
{
    public interface IApplicationSubscriberStore : IApplicationStore
    {
        Task<EntityResult> SetSubscribersAsync(Application app, IList<long> userList, CancellationToken cancellationToken);
    }
}