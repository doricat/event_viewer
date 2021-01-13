using Microsoft.Extensions.DependencyInjection;

namespace Viewer.Web.Services
{
    public static class HostedServiceConfigurator
    {
        public static IServiceCollection AddMyHostedService(this IServiceCollection services, MyDatabaseEnvironment databaseEnvironment)
        {
            services.AddSingleton<IEventStoreQueue, EventStoreQueue>();
            services.AddHostedService<EventStoreBackgroundService>();

            if (databaseEnvironment.IsPostgreSQL())
            {
                services.AddSingleton<IEventDbWriter, PostgreSqlEventWriter>();
            }
            else if (databaseEnvironment.IsSQLite())
            {
                services.AddSingleton<IEventDbWriter, SqliteEventWriter>();
            }

            return services;
        }
    }
}