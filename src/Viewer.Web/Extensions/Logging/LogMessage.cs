using System;

namespace Viewer.Web.Extensions.Logging
{
    public struct LogMessage
    {
        public long? ApplicationId { get; set; }

        public string Category { get; set; }

        public string Level { get; set; }

        public int EventId { get; set; }

        public string EventType { get; set; }

        public string Message { get; set; }

        public int ProcessId { get; set; }

        public Exception Exception { get; set; }

        public DateTime Timestamp { get; set; }
    }
}