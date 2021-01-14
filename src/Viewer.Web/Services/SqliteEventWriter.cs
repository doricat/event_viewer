using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using Viewer.Web.Data;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Services
{
    public class SqliteEventWriter : IEventDbWriter
    {
        private readonly string _connectionString;

        public SqliteEventWriter(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqliteConnection");
        }

        public async Task<EntityResult> WriteAsync(Event evt, CancellationToken cancellationToken)
        {
            using (var conn = new SqliteConnection(_connectionString))
            {
                await conn.OpenAsync(cancellationToken);
                try
                {
                    await conn.ExecuteAsync(@"insert into events(id, global_id, application_id, category, level, event_id, event_type, message, exception, process_id, timestamp)
values (@Id, @GlobalId, @ApplicationId, @Category, @Level, @EventId, @EventType, @Message, @Exception, @ProcessId, @TimeStamp)", evt);
                }
                catch (SqliteException e)
                {
                    return EntityResult.Failed(new EntityError {Description = e.Message});
                }

                return EntityResult.Success;
            }
        }

        public Task<EntityResult> WriteAsync(IList<Event> events, CancellationToken cancellationToken)
        {
            throw new System.NotImplementedException();
        }
    }
}