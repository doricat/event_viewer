using System.Linq;
using Microsoft.EntityFrameworkCore;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Data
{
    public class EventStore : IEventStore, IQueryableEventStore
    {
        public EventStore(ApplicationDbContext context, EntityErrorDescriber errorDescriber)
        {
            Context = context;
            ErrorDescriber = errorDescriber;
        }

        public ApplicationDbContext Context { get; }

        protected DbSet<Event> Events => Context.Events;

        protected EntityErrorDescriber ErrorDescriber { get; }

        public IQueryable<Event> Apps => Events;
    }
}