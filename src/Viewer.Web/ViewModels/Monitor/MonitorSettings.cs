using System.Collections.Generic;
using System.Linq;

namespace Viewer.Web.ViewModels.Monitor
{
    public class MonitorSettings
    {
        public const string CacheKey = "MonitorSettingsCacheKey";

        public IDictionary<string, HashSet<long>> Connections { get; set; } = new Dictionary<string, HashSet<long>>();

        public IDictionary<long, HashSet<string>> Levels { get; set; } = new Dictionary<long, HashSet<string>>();

        public bool ShouldPush(string level, out IList<string> connections)
        {
            if (!Connections.Any())
            {
                connections = new List<string>(0);
                return false;
            }

            connections = new List<string>();

            foreach (var (connection, applications) in Connections)
            {
                foreach (var l in applications)
                {
                    if (Levels.TryGetValue(l, out var levels))
                    {
                        if (levels.Contains(level))
                        {
                            connections.Add(connection);
                        }
                    }
                }
            }

            return false;
        }

        public void AddSetting(string connectionId, long applicationId, string level)
        {
            if (Connections.ContainsKey(connectionId))
            {
                Levels[applicationId].Add(level);
            }
            else
            {
                Connections.Add(connectionId, new HashSet<long>{ applicationId });
                Levels.Add(applicationId, new HashSet<string>
                {
                    "critical", "error", "warning", "information", "debug", "trace"
                });
            }
        }

        public void RemoveSetting(string connectionId, long applicationId, string level)
        {
            if (level == null)
            {
                Levels.Remove(applicationId);
                Connections.Remove(connectionId);
            }
            else
            {
                Levels[applicationId].Remove(level);
            }
        }
    }
}