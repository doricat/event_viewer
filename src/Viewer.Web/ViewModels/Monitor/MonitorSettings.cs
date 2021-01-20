using System.Collections.Generic;
using System.Linq;

namespace Viewer.Web.ViewModels.Monitor
{
    public class MonitorSettings
    {
        public const string CachePrefix = "MonitorSettings_";

        public IDictionary<long, HashSet<string>> ApplicationConnections { get; set; } = new Dictionary<long, HashSet<string>>();

        public static string GetCacheKey(string level)
        {
            return $"{CachePrefix}{level.ToLower()}";
        }

        public IList<string> GetConnections(long applicationId)
        {
            if (ApplicationConnections.ContainsKey(applicationId))
            {
                return ApplicationConnections[applicationId].ToList();
            }

            return new List<string>(0);
        }

        public void AddConnection(long applicationId, string connectionId)
        {
            if (ApplicationConnections.ContainsKey(applicationId))
            {
                ApplicationConnections[applicationId].Add(connectionId);
            }
            else
            {
                ApplicationConnections.Add(applicationId, new HashSet<string>{ connectionId });
            }
        }

        public void RemoveConnection(long applicationId, string connectionId)
        {
            if (ApplicationConnections.ContainsKey(applicationId))
            {
                ApplicationConnections[applicationId].Remove(connectionId);

                if (!ApplicationConnections[applicationId].Any())
                {
                    ApplicationConnections.Remove(applicationId);
                }
            }
        }
    }
}