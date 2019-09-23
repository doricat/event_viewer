using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Data
{
    public class ApplicationStore : IApplicationStore, IQueryableApplicationStore, IApplicationEventStore, IApplicationDetailStore, IApplicationEventSummaryStore
    {
        public ApplicationStore(ApplicationDbContext eventDbContext)
        {
            Context = eventDbContext;
        }

        public ApplicationDbContext Context { get; }

        protected DbSet<Application> Applications => Context.Applications;

        protected DbSet<Event> Events => Context.Events;

        protected EntityErrorDescriber ErrorDescriber { get; set; }

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

        public Task<IDictionary<string, int>> QueryEventSummaryAsync(long appId)
        {
            throw new NotImplementedException();
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

        public IQueryable<Application> Apps => Applications;
    }
}