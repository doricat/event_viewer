using System;
using System.Data.SqlClient;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using Logging;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Viewer.Web.Data;
using Viewer.Web.Data.Entities;
using Viewer.Web.Utilities;

namespace Viewer.Web.Services
{
    public class EventWriter
    {
        private readonly string _connectionString;

        public EventWriter(IOptionsMonitor<EventWriterOptions> options, IdentityGenerator identityGenerator, IConfiguration configuration)
        {
            Options = options.CurrentValue;
            IdentityGenerator = identityGenerator;
            Configuration = configuration;

            _connectionString = Configuration.GetConnectionString("DefaultConnection");
        }

        public EventWriterOptions Options { get; }

        public IdentityGenerator IdentityGenerator { get; }

        public IConfiguration Configuration { get; }

        public async Task<EntityResult> WriteAsync(LogMessage message, CancellationToken cancellationToken)
        {
            var id = await IdentityGenerator.GenerateAsync();
            var evt = new Event
            {
                Id = id,
                GlobalId = id,
                ApplicationId = Options.CurrentApplicationId,
                Category = message.Category,
                Level = message.Level,
                EventId = message.EventId,
                EventType = message.EventType,
                Message = message.Message,
                Exception = JsonConvert.SerializeObject(message.Exception, new JsonSerializerSettings {ReferenceLoopHandling = ReferenceLoopHandling.Ignore}),
                ProcessId = message.ProcessId,
                TimeStamp = message.Timestamp
            };

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