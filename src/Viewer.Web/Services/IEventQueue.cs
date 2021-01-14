using Viewer.Web.Extensions.Logging;

namespace Viewer.Web.Services
{
    public interface IEventQueue : IDataQueue<LogMessage>
    {

    }
}