using System;

namespace Viewer.Web.Hubs
{
    public class EventViewModel
    {
        public long Id { get; set; }

        public long ApplicationId { get; set; }

        public string Level { get; set; }

        public string Category { get; set; }

        public int EventId { get; set; }

        public string EventType { get; set; }

        public string Message { get; set; }

        public DateTime Timestamp { get; set; }
    }
}