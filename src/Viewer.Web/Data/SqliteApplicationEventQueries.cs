using System;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Data
{
    public class SqliteApplicationEventQueries : IApplicationEventQueries
    {
        private readonly string _connectionString;

        public SqliteApplicationEventQueries(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SqliteConnection");
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

            using (var conn = new SqliteConnection(_connectionString))
            {
                await conn.OpenAsync(cancellationToken);
                var result = await conn.QueryFirstAsync<EventStatisticsResult>(@"
pragma temp_store = 2;
create temp table _variables
(
    name          text not null primary key,
    integer_value integer,
    text_value    text,
    numeric_value numeric
);

insert into _variables(name, numeric_value)
values ('one_hour_ago', @one_hour_ago),
       ('one_day_ago', @one_day_ago),
       ('seven_days_ago', @seven_days_ago);

insert into _variables(name, numeric_value)
select 'last1hour', @last_1_hour = count(*)
from events
where application_id = @app_id
  and level = @level
  and timestamp between (select numeric_value from _variables where name = 'one_hour_ago' limit 1) and @now;

insert into _variables(name, numeric_value)
select 'last24hours', @last_24_hours = count(*)
from events
where application_id = @app_id
  and level = @level
  and timestamp between (select numeric_value from _variables where name = 'one_day_ago' limit 1) and @now;

insert into _variables(name, numeric_value)
select 'last7days', @last_7_days = count(*)
from events
where application_id = @app_id
  and level = @level
  and timestamp between (select numeric_value from _variables where name = 'seven_days_ago' limit 1) and @now;

select max(case name when 'last1hour' then numeric_value else 0 end)   last1hour,
       max(case name when 'last24hours' then numeric_value else 0 end) last24hours,
       max(case name when 'last7days' then numeric_value else 0 end)   last7days
from _variables", new
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