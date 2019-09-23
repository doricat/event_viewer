using System.Linq;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Data
{
    public interface IQueryableApplicationStore : IApplicationStore
    {
        IQueryable<Application> Apps { get; }
    }
}