using System;
using System.IO;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Configuration;
using Microsoft.Extensions.Options;

namespace Logging.WebSocket
{
    public static class WebSocketLoggerFactoryExtensions
    {
        public static ILoggingBuilder AddWebSocketLogger(this ILoggingBuilder builder)
        {
            var services = builder.Services;
            builder.AddConfiguration();
            services.TryAddEnumerable(ServiceDescriptor.Singleton<ILoggerProvider, WebSocketLoggerProvider>());
//            services.AddSingleton<IConfigureOptions<LoggerFilterOptions>>();
            services.AddSingleton<IConfigureOptions<WebSocketLoggerOptions>, WebSocketLoggerOptionsSetup>();
            services.AddSingleton<IOptionsChangeTokenSource<WebSocketLoggerOptions>>(new ConfigurationChangeTokenSource<WebSocketLoggerOptions>(new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory()).AddEnvironmentVariables().AddJsonFile("appsettings.json", false).Build()));

            return builder;
        }

        public static ILoggingBuilder AddWebSocketLogger(this ILoggingBuilder builder, Action<WebSocketLoggerOptions> action)
        {
            var services = builder.Services;
            builder.AddConfiguration();
            services.TryAddEnumerable(ServiceDescriptor.Singleton<ILoggerProvider, WebSocketLoggerProvider>());
            services.AddSingleton<IConfigureOptions<WebSocketLoggerOptions>>(provider => new ConfigureOptions<WebSocketLoggerOptions>(action));
            services.AddSingleton<IOptionsChangeTokenSource<WebSocketLoggerOptions>>(new ConfigurationChangeTokenSource<WebSocketLoggerOptions>(new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory()).AddEnvironmentVariables().AddJsonFile("appsettings.json", false).Build()));
            return builder;
        }
    }
}