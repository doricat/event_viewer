using System;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;

namespace Viewer.Web.Services
{
    public class PostgreSqlEventCleaner : IEventCleaner
    {
        private readonly string _connectionString;

        public PostgreSqlEventCleaner(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("PostgreSqlConnection");
        }

        public async Task CleanAsync(long applicationId, DateTime? endTime, CancellationToken cancellationToken)
        {
            if (endTime == null)
            {
                return;
            }

            using (var conn = new SqliteConnection(_connectionString))
            {
                await conn.OpenAsync(cancellationToken);
                await conn.ExecuteAsync("delete from events where application_id = @applicationId and timestamp < @endTime", new { applicationId, endTime });
            }
        }
    }
}