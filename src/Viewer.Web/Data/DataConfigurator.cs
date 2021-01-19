using Microsoft.Extensions.DependencyInjection;
using Viewer.Web.Infrastructure;

namespace Viewer.Web.Data
{
    public static class DataConfigurator
    {
        public static IServiceCollection AddStores(this IServiceCollection services, MyDatabaseEnvironment databaseEnvironment)
        {
            if (databaseEnvironment.IsPostgreSQL())
            {
                services.AddSingleton<IApplicationEventQueries, PostgreSqlApplicationEventQueries>();
            }
            else if (databaseEnvironment.IsSQLite())
            {
                services.AddSingleton<IApplicationEventQueries, SqliteApplicationEventQueries>();
            }

            services.AddScoped<IFileStore, FileStore>();
            services.AddScoped<LocalFileStorageService>();
            services.AddScoped<IEventStore, EventStore>();
            services.AddScoped<IApplicationStore, ApplicationStore>();

            return services;
        }

        public static IServiceCollection AddManagers(this IServiceCollection services)
        {
            services.AddScoped<FileManager>();
            services.AddScoped<EventManager>();
            services.AddScoped<ApplicationManager>();

            return services;
        }
    }
}