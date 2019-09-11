using System.Threading.Tasks;
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

            modelBuilder.Entity<Application>(builder =>
            {
                builder.ToTable("Applications");

                builder.HasKey(x => x.Id);
                builder.HasIndex(x => x.ApplicationId);

                builder.Property(x => x.Id).IsRequired().ValueGeneratedNever();
                builder.Property(x => x.ApplicationId).IsRequired();
                builder.Property(x => x.Name).IsRequired();
                builder.Property(x => x.Description);
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
                builder.Property(x => x.Category).IsRequired();
                builder.Property(x => x.Level).IsRequired();
                builder.Property(x => x.EventId).IsRequired();
                builder.Property(x => x.EventType);
                builder.Property(x => x.Message).IsRequired();
                builder.Property(x => x.ProcessId).IsRequired();
                builder.Property(x => x.Exception);
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
                builder.Property(x => x.Filename).IsRequired();
                builder.Property(x => x.ContentType).IsRequired();
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
    }
}