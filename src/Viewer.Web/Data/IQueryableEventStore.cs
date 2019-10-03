using System.Linq;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Data
{
    public interface IQueryableEventStore : IEventStore
    {
        IQueryable<Event> Apps { get; }
    }
}