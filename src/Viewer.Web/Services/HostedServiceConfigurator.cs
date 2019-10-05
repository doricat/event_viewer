using Microsoft.Extensions.DependencyInjection;

namespace Viewer.Web.Services
{
    public static class HostedServiceConfigurator
    {
        public static IServiceCollection AddMyHostedService(this IServiceCollection services)
        {
            services.AddSingleton<IEventStoreQueue, EventStoreQueue>();
            services.AddSingleton<EventWriter>();
            services.AddHostedService<EventStoreBackgroundService>();

            return services;
        }
    }
}