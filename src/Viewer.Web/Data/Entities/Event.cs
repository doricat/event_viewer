using System;

namespace Viewer.Web.Data.Entities
{
    public class Event
    {
        public long Id { get; set; }

        public long GlobalId { get; set; }

        public long ApplicationId { get; set; }

        public string Category { get; set; }

        public string Level { get; set; }

        public int EventId { get; set; }

        public string EventType { get; set; }

        public string Message { get; set; }

        public string Exception { get; set; }

        public int ProcessId { get; set; }

        public DateTime TimeStamp { get; set; } = DateTime.Now;

        public virtual Application Application { get; set; }
    }
}