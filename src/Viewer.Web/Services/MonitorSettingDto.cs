namespace Viewer.Web.Services
{
    public class MonitorSettingDto
    {
        public long ApplicationId { get; set; }

        public string ConnectionId { get; set; }

        public string Level { get; set; }

        public bool Addition { get; set; }

        public static MonitorSettingDto Add(long applicationId, string connectionId)
        {
            return Add(applicationId, connectionId, null);
        }

        public static MonitorSettingDto Add(long applicationId, string connectionId, string level)
        {
            return new MonitorSettingDto
            {
                Addition = true,
                ApplicationId = applicationId,
                ConnectionId = connectionId,
                Level = level
            };
        }

        public static MonitorSettingDto Remove(long applicationId, string connectionId)
        {
            return Remove(applicationId, connectionId, null);
        }

        public static MonitorSettingDto Remove(long applicationId, string connectionId, string level)
        {
            return new MonitorSettingDto
            {
                Addition = false,
                ApplicationId = applicationId,
                ConnectionId = connectionId,
                Level = level
            };
        }
    }
}