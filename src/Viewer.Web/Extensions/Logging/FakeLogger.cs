using System;
using Microsoft.Extensions.Logging;

namespace Viewer.Web.Extensions.Logging
{
    public class FakeLogger : ILogger
    {
        private readonly FakeLoggerProvider _loggerProvider;
        private readonly string _category;

        public FakeLogger(FakeLoggerProvider loggerProvider, string category)
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
