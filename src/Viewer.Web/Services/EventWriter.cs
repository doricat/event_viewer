using System.Data.SqlClient;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using Viewer.Web.Data;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Services
{
    public class EventWriter
    {
        private readonly string _connectionString;

        public EventWriter(IConfiguration configuration)
        {
            Configuration = configuration;
            _connectionString = Configuration.GetConnectionString("DefaultConnection");
        }

        public IConfiguration Configuration { get; }

        public async Task<EntityResult> WriteAsync(Event evt, CancellationToken cancellationToken)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync(cancellationToken);
                try
                {
                    await conn.ExecuteAsync(@"insert into Events(Id, GlobalId, ApplicationId, Category, Level, EventId, EventType, Message, Exception, ProcessId, TimeStamp)
values (@Id, @GlobalId, @ApplicationId, @Category, @Level, @EventId, @EventType, @Message, @Exception, @ProcessId, @TimeStamp)", evt);
                }
                catch (SqlException e)
                {
                    return EntityResult.Failed(new EntityError {Description = e.Message});
                }

                return EntityResult.Success;
            }
        }
    }
}