using System.Threading;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using Viewer.Web.Data;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Services
{
    public class PostgreSqlEventWriter : IEventDbWriter
    {
        private readonly string _connectionString;

        public PostgreSqlEventWriter(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("PostgreSqlConnection");
        }

        public async Task<EntityResult> WriteAsync(Event evt, CancellationToken cancellationToken)
        {
            using (var conn = new NpgsqlConnection(_connectionString))
            {
                await conn.OpenAsync(cancellationToken);
                try
                {
                    await conn.ExecuteAsync(@"insert into events(id, global_id, application_id, category, level, event_id, event_type, message, exception, process_id, timestamp)
values (@Id, @GlobalId, @ApplicationId, @Category, @Level, @EventId, @EventType, @Message, @Exception, @ProcessId, @TimeStamp)", evt);
                }
                catch (NpgsqlException e)
                {
                    return EntityResult.Failed(new EntityError {Description = e.Message});
                }

                return EntityResult.Success;
            }
        }
    }
}