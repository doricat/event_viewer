using Microsoft.Extensions.DependencyInjection;
using Viewer.Web.Infrastructure;

namespace Viewer.Web.Services
{
    public static class HostedServiceConfigurator
    {
        public static IServiceCollection AddMyHostedService(this IServiceCollection services, MyDatabaseEnvironment databaseEnvironment)
        {
            services.AddSingleton<IEventStoreQueue, EventStoreQueue>();
            services.AddSingleton<IEventQueue, EventQueue>();
            services.AddSingleton<IMonitorSettingsUpdatingQueue, MonitorSettingsUpdatingQueue>();
            services.AddHostedService<EventStoreBackgroundService>();
            services.AddHostedService<EventPushBackgroundService>();
            services.AddHostedService<MonitorSettingsBackgroundService>();
            services.AddSingleton<IEventDbWriter, EventWriter>();

            return services;
        }
    }
}