using System.Collections.Generic;

namespace Viewer.Web.ViewModels.Monitor
{
    public class MonitorSettings
    {
        public long ApplicationId { get; set; }

        public HashSet<string> Levels { get; set; }
    }
}