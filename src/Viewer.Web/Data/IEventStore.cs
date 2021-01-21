using System.Threading.Tasks;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Data
{
    public interface IEventStore
    {
        Task<Event> FindByIdAsync(long id);
    }
}