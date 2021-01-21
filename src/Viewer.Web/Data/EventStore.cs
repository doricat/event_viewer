using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Data
{
    public class EventStore : IEventStore, IQueryableEventStore
    {
        public EventStore(MyDbContext context, EntityErrorDescriber errorDescriber)
        {
            Context = context;
            ErrorDescriber = errorDescriber;
        }

        public MyDbContext Context { get; }

        protected DbSet<Event> Events => Context.Events;

        protected EntityErrorDescriber ErrorDescriber { get; }

        public IQueryable<Event> Apps => Events;

        public async Task<Event> FindByIdAsync(long id)
        {
            return await Events.FirstOrDefaultAsync(x => x.Id == id);
        }
    }
}