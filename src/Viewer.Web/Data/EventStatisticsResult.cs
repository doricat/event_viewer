namespace Viewer.Web.Data
{
    public class EventStatisticsResult
    {
        public string Level { get; set; }

        public int Last1Hour { get; set; }

        public int Last24Hours { get; set; }

        public int Last7Days { get; set; }
    }
}