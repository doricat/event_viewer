using System;

namespace Logging.WebSocket
{
    public struct LogMessage
    {
        public string Category { get; set; }

        public string Level { get; set; }

        public int EventId { get; set; }

        public string EventType { get; set; }

        public string Message { get; set; }

        public int ProcessId { get; set; }

        public object Exception { get; set; }

        public DateTime Timestamp { get; set; }
    }
}