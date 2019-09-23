using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
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

            modelBuilder.Entity<User>(builder =>
            {
                builder.Property(x => x.Id).ValueGeneratedNever();
                builder.Property(x => x.Name).HasMaxLength(50);
                builder.Property(x => x.Avatar).HasMaxLength(500);
            });

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
}