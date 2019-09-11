using System;
using Microsoft.Extensions.Logging;

namespace Logging.WebSocket
{
    public class WebSocketLogger : ILogger
    {
        private readonly WebSocketLoggerProvider _loggerProvider;
        private readonly string _category;

        public WebSocketLogger(WebSocketLoggerProvider loggerProvider, string category)
        {
            _loggerProvider = loggerProvider;
            _category = category;
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
        {
            if (!IsEnabled(logLevel))
            {
                return;
            }

            var message = new LogMessage
            {
                Category = _category,
                Level = logLevel.ToString(),
                EventId = eventId.Id,
                EventType = eventId.Name,
                Timestamp = DateTime.Now,
                Message = formatter(state, exception)
            };

            if (exception != null)
            {
                message.Exception = exception;
            }

            _loggerProvider.AddMessage(message);
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            return _loggerProvider.IsEnabled;
        }

        public IDisposable BeginScope<TState>(TState state)
        {
            return null;
        }
    }
}