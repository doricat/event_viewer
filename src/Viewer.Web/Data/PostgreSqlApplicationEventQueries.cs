using System;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Data
{
    public class PostgreSqlApplicationEventQueries : IApplicationEventQueries
    {
        private readonly string _connectionString;

        public PostgreSqlApplicationEventQueries(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("PostgreSqlConnection");
        }

        public async Task<EventStatisticsResult> CountEventAsync(Application app, string level, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (app == null) throw new ArgumentNullException(nameof(app));
            if (level == null) throw new ArgumentNullException(nameof(level));

            var now = DateTime.Now;
            var oneHourAgo = now.AddHours(-1);
            var oneDayAgo = now.AddDays(-1);
            var sevenDaysAgo = now.AddDays(-7);

            using (var conn = new NpgsqlConnection(_connectionString))
            {
                await conn.OpenAsync(cancellationToken);
                var result = await conn.QueryFirstAsync<EventStatisticsResult>(@"
with cte as (
    select count(*) as value, 'last1hour' as name
    from events
    where application_id = @app_id
      and lower(level) = lower(@level)
      and timestamp between @one_hour_ago and @now
    union all
    select count(*) as value, 'last24hours' as name
    from events
    where application_id = @app_id
      and lower(level) = lower(@level)
      and timestamp between @one_day_ago and @now
    union all
    select count(*) as value, 'last7days' as name
    from events
    where application_id = @app_id
      and lower(level) = lower(@level)
      and timestamp between @seven_days_ago and @now
)
select max(case name when 'last1hour' then value else 0 end)   last1hour,
       max(case name when 'last24hours' then value else 0 end) last24hours,
       max(case name when 'last7days' then value else 0 end)   last7days
from cte", new
                {
                    app_id = app.Id,
                    level,
                    one_hour_ago = oneHourAgo,
                    one_day_ago = oneDayAgo,
                    seven_days_ago = sevenDaysAgo,
                    now
                });

                result.Level = level;
                result.OneHourAgo = oneHourAgo;
                result.OneDayAgo = oneDayAgo;
                result.SevenDaysAgo = sevenDaysAgo;
                result.EndTime = now;

                return result;
            }
        }
    }
}