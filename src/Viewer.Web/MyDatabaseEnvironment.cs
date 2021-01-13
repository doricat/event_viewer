using System;

namespace Viewer.Web
{
    public class MyDatabaseEnvironment
    {
        public MyDatabaseEnvironment(string environmentName)
        {
            EnvironmentName = environmentName ?? throw new ArgumentNullException(nameof(environmentName));
        }

        public string EnvironmentName { get; }

        public bool IsPostgreSQL()
        {
            return EnvironmentName.Equals("PostgreSQL", StringComparison.OrdinalIgnoreCase);
        }

        public bool IsSQLServer()
        {
            return EnvironmentName.Equals("SQLServer", StringComparison.OrdinalIgnoreCase);
        }

        public bool IsSQLite()
        {
            return EnvironmentName.Equals("SQLite", StringComparison.OrdinalIgnoreCase);
        }
    }
}