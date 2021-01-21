using System;
using Viewer.Web.Data.Entities;

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

        public static EventListGetModel FromEvent(Event evt)
        {
            return new EventListGetModel
            {
                Id = evt.Id,
                ApplicationId = evt.ApplicationId,
                Category = evt.Category,
                Level = evt.Level,
                Message = evt.Message,
                ProcessId = evt.ProcessId,
                Timestamp = evt.TimeStamp
            };
        }
    }
}