using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Data
{
    public class ApplicationDbContext : IdentityDbContext<User, Role, long>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Application> Applications { get; set; }

        public DbSet<Event> Events { get; set; }

        public DbSet<FileMetadata> Files { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(builder => { builder.Property(x => x.Id).ValueGeneratedNever(); });
            modelBuilder.Entity<Role>(builder => { builder.Property(x => x.Id).ValueGeneratedNever(); });

            modelBuilder.Entity<Application>(builder =>
            {
                builder.ToTable("Applications");

                builder.HasKey(x => x.Id);
                builder.HasIndex(x => x.ApplicationId);

                builder.Property(x => x.Id).IsRequired().ValueGeneratedNever();
                builder.Property(x => x.ApplicationId).HasMaxLength(50).IsRequired();
                builder.Property(x => x.Name).HasMaxLength(50).IsRequired();
                builder.Property(x => x.Description).HasMaxLength(250);
                builder.Property(x => x.Enabled).IsRequired();
            });

            modelBuilder.Entity<Event>(builder =>
            {
                builder.ToTable("Events");

                builder.HasKey(x => x.Id);
                builder.HasIndex(x => x.GlobalId);
                builder.HasIndex(x => new {x.ApplicationId, x.Category});
                builder.HasIndex(x => new {x.ApplicationId, x.Level});
                builder.HasIndex(x => new {x.ApplicationId, x.Level, x.TimeStamp});
                builder.HasIndex(x => x.TimeStamp);

                builder.Property(x => x.Id).IsRequired().ValueGeneratedNever();
                builder.Property(x => x.GlobalId).IsRequired();
                builder.Property(x => x.ApplicationId).IsRequired();
                builder.Property(x => x.Category).HasMaxLength(250).IsRequired();
                builder.Property(x => x.Level).HasMaxLength(50).IsRequired();
                builder.Property(x => x.EventId).IsRequired();
                builder.Property(x => x.EventType).HasMaxLength(50);
                builder.Property(x => x.Message).HasColumnType("nvarchar(max)").IsRequired();
                builder.Property(x => x.ProcessId).IsRequired();
                builder.Property(x => x.Exception).HasColumnType("nvarchar(max)");
                builder.Property(x => x.TimeStamp).IsRequired();

                builder.HasOne(x => x.Application).WithMany(x => x.Events).HasForeignKey(x => x.ApplicationId).OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<UserApplication>(builder =>
            {
                builder.ToTable("UserApplication");

                builder.HasKey(x => new {x.UserId, x.ApplicationId});

                builder.Property(x => x.UserId).IsRequired();
                builder.Property(x => x.ApplicationId).IsRequired();

                builder.HasOne(x => x.Application).WithMany(x => x.Users).HasForeignKey(x => x.ApplicationId);
                builder.HasOne(x => x.User).WithMany(x => x.Applications).HasForeignKey(x => x.UserId);
            });

            modelBuilder.Entity<FileMetadata>(builder =>
            {
                builder.ToTable("Files");

                builder.Property(x => x.Id).IsRequired().ValueGeneratedNever();
                builder.Property(x => x.Filename).HasMaxLength(255).IsRequired();
                builder.Property(x => x.ContentType).HasMaxLength(50).IsRequired();
                builder.Property(x => x.Size).IsRequired();
                builder.Property(x => x.RawName);
            });
        }
    }

    public interface IFileStore
    {
        Task<FileMetadata> FindByIdAsync(long id);
    }

    public class FileStore : IFileStore
    {
        public FileStore(ApplicationDbContext dbContext)
        {
            DbContext = dbContext;
        }

        public ApplicationDbContext DbContext { get; }

        protected DbSet<FileMetadata> Files => DbContext.Files;

        public async Task<FileMetadata> FindByIdAsync(long id)
        {
            return await Files.FindAsync(id);
        }
    }

    public class FileManager
    {
        public FileManager(ILogger<FileManager> logger, IFileStore fileStore)
        {
            Logger = logger;
            FileStore = fileStore;
        }

        public ILogger<FileManager> Logger { get; }

        public IFileStore FileStore { get; }

        public async Task<FileMetadata> FindByIdAsync(long id)
        {
            return await FileStore.FindByIdAsync(id);
        }
    }

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

    public interface IApplicationStore
    {
        Task<Application> FindByNameAsync(string name);

        Task<Application> FindByIdAsync(string id);

        Task<EntityResult> DeleteAsync(Application app, CancellationToken cancellationToken);

        Task<EntityResult> UpdateAsync(Application app, CancellationToken cancellationToken);

        Task<EntityResult> CreateAsync(Application app, CancellationToken cancellationToken);
    }

    public class EntityResult
    {
        private readonly List<EntityError> _errors = new List<EntityError>();

        public bool Succeeded { get; protected set; }

        public IList<EntityError> Errors { get; } = new List<EntityError>();

        public static EntityResult Success { get; } = new EntityResult {Succeeded = true};

        public static EntityResult Failed(params EntityError[] errors)
        {
            var result = new EntityResult {Succeeded = false};
            if (errors != null)
            {
                result._errors.AddRange(errors);
            }

            return result;
        }

        public override string ToString()
        {
            return Succeeded ? "Succeeded" : $"Failed : {string.Join(",", Errors.Select(x => x.Code).ToList())}";
        }
    }

    public class EntityError
    {
        public string Code { get; set; }

        public string Description { get; set; }
    }

    public interface IQueryableApplicationStore : IApplicationStore
    {
        IQueryable<Application> Apps { get; }
    }

    public interface IApplicationEventStore : IApplicationStore
    {
        Task<EntityResult> AddEventAsync(Application app, Event evt, CancellationToken cancellationToken);

        Task<EntityResult> AddEventAsync(long appId, Event evt, CancellationToken cancellationToken);
    }

    public interface IApplicationEventSummaryStore : IApplicationStore
    {
        Task<IDictionary<string, int>> QueryEventSummaryAsync(long appId);
    }

    public interface IApplicationDetailStore : IApplicationStore
    {
        Task<Tuple<Application, int>> FindDetailByIdAsync(string id);
    }

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

    public class EntityErrorDescriber
    {
        public virtual EntityError DefaultError()
        {
            return new EntityError
            {
                Code = nameof(DefaultError),
                Description = ""
            };
        }

        public virtual EntityError ConcurrencyFailure()
        {
            return new EntityError
            {
                Code = nameof(ConcurrencyFailure),
                Description = ""
            };
        }
    }
}