using System;

namespace Viewer.Web.Extensions.Logging
{
    public class FakeLoggerOptions
    {
        public TimeSpan FlushPeriod { get; set; } = TimeSpan.FromSeconds(1);

        public int? BackgroundQueueSize { get; set; } = 1000;

        public int? BatchSize { get; set; }

        public bool IsEnabled { get; set; }
    }
}