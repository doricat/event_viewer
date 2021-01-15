using System;

namespace Viewer.Web.ViewModels.Application
{
    public class EventListGetModel
    {
        public long Id { get; set; }

        public long ApplicationId { get; set; }

        public string Category { get; set; }

        public string Level { get; set; }

        public string Message { get; set; }

        public int ProcessId { get; set; }

        public DateTime Timestamp { get; set; }
    }
}