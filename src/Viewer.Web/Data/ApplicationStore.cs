using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Data
{
    public class ApplicationStore : IApplicationStore,
        IQueryableApplicationStore,
        IApplicationEventStore,
        IApplicationDetailStore,
        IApplicationSubscriberStore
    {
        public ApplicationStore(ApplicationDbContext eventDbContext, EntityErrorDescriber errorDescriber)
        {
            Context = eventDbContext;
            ErrorDescriber = errorDescriber;
        }

        public ApplicationDbContext Context { get; }

        protected DbSet<Application> Applications => Context.Applications;

        protected DbSet<Event> Events => Context.Events;

        protected EntityErrorDescriber ErrorDescriber { get; }

        public async Task<Application> FindByNameAsync(string name)
        {
            return await Applications.FirstOrDefaultAsync(x => x.Name == name);
        }

        public async Task<Application> FindByIdAsync(string id)
        {
            if (long.TryParse(id, out var i))
            {
                return await Applications.FirstOrDefaultAsync(x => x.Id == i);
            }

            return await Applications.FirstOrDefaultAsync(x => x.ApplicationId == id);
        }

        public async Task<EntityResult> DeleteAsync(Application app, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (app == null) throw new ArgumentNullException(nameof(app));

            Context.Remove(app);

            try
            {
                await Context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateConcurrencyException)
            {
                return EntityResult.Failed(ErrorDescriber.ConcurrencyFailure());
            }

            return EntityResult.Success;
        }

        public async Task<EntityResult> UpdateAsync(Application app, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (app == null) throw new ArgumentNullException(nameof(app));

            Context.Attach(app);
            Context.Update(app);

            try
            {
                await Context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateConcurrencyException)
            {
                return EntityResult.Failed(ErrorDescriber.ConcurrencyFailure());
            }

            return EntityResult.Success;
        }

        public async Task<EntityResult> CreateAsync(Application app, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (app == null) throw new ArgumentNullException(nameof(app));

            Context.Add(app);

            try
            {
                await Context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateConcurrencyException)
            {
                return EntityResult.Failed(ErrorDescriber.ConcurrencyFailure());
            }

            return EntityResult.Success;
        }

        public async Task<EntityResult> SetSubscribersAsync(Application app, IList<long> userList, CancellationToken cancellationToken)
        {
            var appUsers = await Context.Set<UserApplication>().Where(x => x.ApplicationId == app.Id).ToListAsync(cancellationToken);
            var appUserList = appUsers.Select(x => x.UserId).ToList();
            var list1 = userList.Except(appUserList).ToList();
            var list2 = appUserList.Except(userList).ToList();

            foreach (var i in list1)
            {
                Context.Add(new UserApplication {UserId = i, ApplicationId = app.Id});
            }

            foreach (var i in list2)
            {
                var item = appUsers.First(x => x.UserId == i);
                Context.Remove(item);
            }

            try
            {
                await Context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateConcurrencyException)
            {
                return EntityResult.Failed(ErrorDescriber.ConcurrencyFailure());
            }

            return EntityResult.Success;
        }

        public Task<Tuple<Application, int>> FindDetailByIdAsync(string id)
        {
            Task<Application> appTask;
            Task<int> eventCountTask;
            if (long.TryParse(id, out var i))
            {
                appTask = Context.Applications.Include(x => x.Users).FirstOrDefaultAsync(x => x.Id == i);
                eventCountTask = Context.Events.Where(x => x.ApplicationId == i).CountAsync();
            }
            else
            {
                appTask = Context.Applications.Include(x => x.Users).FirstOrDefaultAsync(x => x.ApplicationId == id);
                eventCountTask = Context.Events.Where(x => x.Application.ApplicationId == id).CountAsync();
            }

            Task.WaitAll(appTask, eventCountTask);
            return Task.FromResult(new Tuple<Application, int>(appTask.Result, eventCountTask.Result));
        }

        public async Task<EntityResult> AddEventAsync(Application app, Event evt, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (app == null) throw new ArgumentNullException(nameof(app));
            if (evt == null) throw new ArgumentNullException(nameof(evt));

            app.Events = new List<Event> {evt};
            Context.Attach(app);

            try
            {
                await Context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateConcurrencyException)
            {
                return EntityResult.Failed(ErrorDescriber.ConcurrencyFailure());
            }

            return EntityResult.Success;
        }

        public async Task<EntityResult> AddEventAsync(long appId, Event evt, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (evt == null) throw new ArgumentNullException(nameof(evt));

            evt.ApplicationId = appId;
            Context.Add(evt);

            try
            {
                await Context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateConcurrencyException)
            {
                return EntityResult.Failed(ErrorDescriber.ConcurrencyFailure());
            }

            return EntityResult.Success;
        }

        public async Task<EventStatisticsResult> CountEventAsync(Application app, string level, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (app == null) throw new ArgumentNullException(nameof(app));
            if (level == null) throw new ArgumentNullException(nameof(level));

            var result = await Context.EventStatistics.FromSql(@"
declare
    @last_1_hour   int,
    @last_24_hours int,
    @last_7_days   int,
    @now           datetime = getdate();

declare
    @one_hour_ago   datetime = dateadd(hh, -1, @now),
    @one_day_ago    datetime = dateadd(hh, -24, @now),
    @seven_days_ago datetime = dateadd(dd, -7, @now);

select @last_1_hour = count(*)
from Events
where ApplicationId = @app_id
  and Level = @level
  and TimeStamp between @one_hour_ago and @now;

select @last_24_hours = count(*)
from Events
where ApplicationId = @app_id
  and Level = @level
  and TimeStamp between @one_day_ago and @now;

select @last_7_days = count(*)
from Events
where ApplicationId = @app_id
  and Level = @level
  and TimeStamp between @seven_days_ago and @now;

select @level          as level,
       @last_1_hour    as last1hour,
       @last_24_hours  as last24hours,
       @last_7_days    as last7days,
       @one_hour_ago   as OneHourAgo,
       @one_day_ago    as OneDayAgo,
       @seven_days_ago as SevenDaysAgo,
       @now            as EndTime",
                new SqlParameter("@app_id", SqlDbType.BigInt) {Value = app.Id},
                new SqlParameter("@level", SqlDbType.NVarChar, 50) {Value = level}).FirstOrDefaultAsync(cancellationToken);

            return result;
        }

        public IQueryable<Application> Apps => Applications;
    }
}