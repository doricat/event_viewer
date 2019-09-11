using System;
using System.Collections.Generic;

namespace Logging.WebSocket
{
    public class WebSocketLoggerOptions
    {
        public TimeSpan FlushPeriod { get; set; } = TimeSpan.FromSeconds(1);

        public int? BackgroundQueueSize { get; set; } = 1000;

        public int? BatchSize { get; set; }

        public bool IsEnabled { get; set; }

        public string Url { get; set; }

        public string MethodName { get; set; }

        public string ClientId { get; set; }

        public string Secret { get; set; }

        public IList<Exception> Validate()
        {
            var exceptions = new List<Exception>();

            if (FlushPeriod <= TimeSpan.Zero)
            {
                exceptions.Add(new ArgumentOutOfRangeException(nameof(FlushPeriod), $"{nameof(FlushPeriod)} 必须是有效值."));
            }

            if (BackgroundQueueSize != null && BackgroundQueueSize.Value < 0)
            {
                exceptions.Add(new ArgumentOutOfRangeException(nameof(BackgroundQueueSize), $"{nameof(BackgroundQueueSize)} 必须是非负数."));
            }

            if (BatchSize != null && BatchSize.Value < 0)
            {
                exceptions.Add(new ArgumentOutOfRangeException(nameof(BatchSize), $"{nameof(BatchSize)} 必须是非负数."));
            }

            if (string.IsNullOrWhiteSpace(Url))
            {
                exceptions.Add(new ArgumentOutOfRangeException(nameof(Url), $"{nameof(Url)} 不能为空."));
            }

            if (string.IsNullOrWhiteSpace(MethodName))
            {
                exceptions.Add(new ArgumentOutOfRangeException(nameof(MethodName), $"{nameof(MethodName)} 不能为空."));
            }

            if (string.IsNullOrWhiteSpace(ClientId))
            {
                exceptions.Add(new ArgumentOutOfRangeException(nameof(ClientId), $"{nameof(ClientId)} 不能为空."));
            }

            if (string.IsNullOrWhiteSpace(Secret))
            {
                exceptions.Add(new ArgumentOutOfRangeException(nameof(Secret), $"{nameof(Secret)} 不能为空."));
            }

            return exceptions;
        }
    }
}