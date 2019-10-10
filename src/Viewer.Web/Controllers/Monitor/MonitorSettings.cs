using System.Collections.Generic;

namespace Viewer.Web.Controllers.Monitor
{
    public class MonitorSettings
    {
        public long AppId { get; set; }

        public HashSet<string> Levels { get; set; }
    }
}