using System;
using System.IO;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Configuration;
using Microsoft.Extensions.Options;

namespace Viewer.Web.Extensions.Logging
{
    public static class FakeLoggerFactoryExtensions
    {
        public static ILoggingBuilder AddFakeLogger(this ILoggingBuilder builder)
        {
            var services = builder.Services;
            builder.AddConfiguration();
            services.TryAddEnumerable(ServiceDescriptor.Singleton<ILoggerProvider, FakeLoggerProvider>());
            //services.AddSingleton<IConfigureOptions<LoggerFilterOptions>>();
            services.AddSingleton<IConfigureOptions<FakeLoggerOptions>, FakeLoggerOptionsSetup>();
            services.AddSingleton<IOptionsChangeTokenSource<FakeLoggerOptions>>(new ConfigurationChangeTokenSource<FakeLoggerOptions>(new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory()).AddEnvironmentVariables().AddJsonFile("appsettings.json", false).Build()));

            return builder;
        }

        public static ILoggingBuilder AddFakeLogger(this ILoggingBuilder builder, Action<FakeLoggerOptions> action)
        {
            var services = builder.Services;
            builder.AddConfiguration();
            services.TryAddEnumerable(ServiceDescriptor.Singleton<ILoggerProvider, FakeLoggerProvider>());
            services.AddSingleton<IConfigureOptions<FakeLoggerOptions>>(provider => new ConfigureOptions<FakeLoggerOptions>(action));
            services.AddSingleton<IOptionsChangeTokenSource<FakeLoggerOptions>>(new ConfigurationChangeTokenSource<FakeLoggerOptions>(new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory()).AddEnvironmentVariables().AddJsonFile("appsettings.json", false).Build()));
            return builder;
        }
    }
}