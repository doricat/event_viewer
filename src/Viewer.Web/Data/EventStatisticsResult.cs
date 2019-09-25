using System;

namespace Viewer.Web.Data
{
    public class EventStatisticsResult
    {
        public string Level { get; set; }

        public int Last1Hour { get; set; }

        public int Last24Hours { get; set; }

        public int Last7Days { get; set; }

        public DateTime OneHourAgo { get; set; }

        public DateTime OneDayAgo { get; set; }

        public DateTime SevenDaysAgo { get; set; }

        public DateTime EndTime { get; set; }
    }
}