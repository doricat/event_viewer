using System.Threading.Tasks;

namespace Viewer.Web.Hubs
{
    public interface IEventClient
    {
        Task ReceiveEvent(EventViewModel message);
    }
}