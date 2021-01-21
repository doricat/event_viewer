using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Viewer.Web.Data;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Services
{
    public class EventWriter : IEventDbWriter
    {
        private readonly IServiceProvider _serviceProvider;

        public EventWriter(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public async Task WriteAsync(IList<Event> events, CancellationToken cancellationToken)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetService<MyDbContext>();
                await dbContext.Events.AddRangeAsync(events, cancellationToken);
                await dbContext.SaveChangesAsync(cancellationToken);
            }
        }
    }
}