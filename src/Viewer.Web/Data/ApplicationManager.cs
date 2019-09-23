using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Data
{
    public class ApplicationManager
    {
        public ApplicationManager(IApplicationStore store, IHttpContextAccessor httpContextAccessor)
        {
            Store = store ?? throw new ArgumentNullException(nameof(store));
            HttpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        }

        public IApplicationStore Store { get; }

        public IHttpContextAccessor HttpContextAccessor { get; }

        protected CancellationToken CancellationToken => HttpContextAccessor.HttpContext.RequestAborted;

        public IQueryable<Application> Applications
        {
            get
            {
                if (!(Store is IQueryableApplicationStore queryableStore))
                {
                    throw new NotSupportedException();
                }

                return queryableStore.Apps;
            }
        }

        public async Task<Application> FindByIdAsync(string id)
        {
            return await Store.FindByIdAsync(id);
        }

        public async Task<Tuple<Application, int>> FindDetailByIdAsync(string id)
        {
            return await GetDetailStore().FindDetailByIdAsync(id);
        }

        public async Task<EntityResult> CreateApplicationAsync(Application app)
        {
            return await Store.CreateAsync(app, CancellationToken);
        }

        public async Task<EntityResult> RemoveApplicationAsync(Application app)
        {
            return await Store.DeleteAsync(app, CancellationToken);
        }

        public Task<Event> FindEventByIdAsync(long id)
        {
            throw new NotImplementedException();
        }

        public async Task<EntityResult> UpdateAsync(Application app)
        {
            return await Store.UpdateAsync(app, CancellationToken);
        }

        public Task<EntityResult> SetSubscribersAsync(Application app, IList<long> userList)
        {
            throw new NotImplementedException();
        }

        private IApplicationDetailStore GetDetailStore()
        {
            if (!(Store is IApplicationDetailStore detailStore))
            {
                throw new NotSupportedException();
            }

            return detailStore;
        }
    }
}