using Viewer.Web.Data.Entities;

namespace Viewer.Web.Services
{
    public interface IEventStoreQueue : IDataQueue<Event>
    {
    }
}