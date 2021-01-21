using System;
using System.Collections.Generic;
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
        public ApplicationStore(MyDbContext eventDbContext, EntityErrorDescriber errorDescriber)
        {
            Context = eventDbContext;
            ErrorDescriber = errorDescriber;
        }

        public MyDbContext Context { get; }

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

        public async Task<Tuple<Application, int>> FindDetailByIdAsync(string id)
        {
            Application app;
            int eventCount;
            if (long.TryParse(id, out var i))
            {
                app = await Context.Applications.Include(x => x.Users).FirstOrDefaultAsync(x => x.Id == i);
                eventCount = await Context.Events.Where(x => x.ApplicationId == i).CountAsync();
            }
            else
            {
                app = await Context.Applications.Include(x => x.Users).FirstOrDefaultAsync(x => x.ApplicationId == id);
                eventCount = await Context.Events.Where(x => x.Application.ApplicationId == id).CountAsync();
            }

            return new Tuple<Application, int>(app, eventCount);
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
            throw new NotImplementedException();
        }

        public IQueryable<Application> Apps => Applications;
    }
}