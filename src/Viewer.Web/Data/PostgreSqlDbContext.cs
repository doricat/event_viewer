using System.Reflection;
using IdentityServer4.EntityFramework.Entities;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Data
{
    public class PostgreSqlDbContext : MyDbContext
    {
        private readonly IConfiguration _configuration;

        public PostgreSqlDbContext(DbContextOptions<PostgreSqlDbContext> options,
            IOptions<OperationalStoreOptions> operationalStoreOptions,
            IConfiguration configuration) : base(options, operationalStoreOptions)
        {
            _configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            var connectionString = _configuration.GetConnectionString("PostgreSqlConnection");
            optionsBuilder.UseNpgsql(connectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(builder =>
            {
                builder.ToTable("users");

                builder.HasKey(x => x.Id).HasName("pk_users");
                builder.HasIndex(x => x.NormalizedUserName).HasName("ix_users_normalized_user_name");
                builder.HasIndex(x => x.NormalizedEmail).HasName("ix_users_normalized_email");

                builder.Property(x => x.Id).HasColumnName("id").HasColumnType("bigint").ValueGeneratedNever();
                builder.Property(x => x.UserName).HasColumnName("user_name").HasColumnType("varchar(256)").HasMaxLength(256);
                builder.Property(x => x.NormalizedUserName).HasColumnName("normalized_user_name").HasColumnType("varchar(256)").HasMaxLength(256);
                builder.Property(x => x.Email).HasColumnName("email").HasColumnType("varchar(256)").HasMaxLength(256);
                builder.Property(x => x.NormalizedEmail).HasColumnName("normalized_email").HasColumnType("varchar(256)").HasMaxLength(256);
                builder.Property(x => x.EmailConfirmed).HasColumnName("email_confirmed").HasColumnType("boolean").IsRequired();
                builder.Property(x => x.PasswordHash).HasColumnName("password_hash").HasColumnType("varchar(256)");
                builder.Property(x => x.SecurityStamp).HasColumnName("security_stamp").HasColumnType("varchar(256)");
                builder.Property(x => x.ConcurrencyStamp).HasColumnName("concurrency_stamp").HasColumnType("varchar(256)");
                builder.Property(x => x.PhoneNumber).HasColumnName("phone_number").HasColumnType("varchar(50)");
                builder.Property(x => x.PhoneNumberConfirmed).HasColumnName("phone_number_confirmed").HasColumnType("boolean").IsRequired();
                builder.Property(x => x.TwoFactorEnabled).HasColumnName("two_factor_enabled").HasColumnType("boolean").IsRequired();
                builder.Property(x => x.LockoutEnd).HasColumnName("lockout_end").HasColumnType("timestamptz");
                builder.Property(x => x.LockoutEnabled).HasColumnName("lockout_enabled").HasColumnType("boolean").IsRequired();
                builder.Property(x => x.AccessFailedCount).HasColumnName("access_failed_count").HasColumnType("int").IsRequired();
                builder.Property(x => x.Name).HasColumnName("name").HasColumnType("varchar(50)").HasMaxLength(50);
                builder.Property(x => x.AvatarId).HasColumnName("avatar_id").HasColumnType("bigint");

                builder.HasOne<FileMetadata>()
                    .WithMany()
                    .HasForeignKey(x => x.AvatarId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("fk_users_files_file_id");
            });

            modelBuilder.Entity<Role>(builder =>
            {
                builder.ToTable("roles");

                builder.HasKey(x => x.Id).HasName("pk_roles");
                builder.HasIndex(x => x.NormalizedName).HasName("ix_roles_normalized_name");

                builder.Property(x => x.Id).HasColumnName("id").HasColumnType("bigint").ValueGeneratedNever();
                builder.Property(x => x.Name).HasColumnName("name").HasColumnType("varchar(256)").HasMaxLength(256);
                builder.Property(x => x.NormalizedName).HasColumnName("normalized_name").HasColumnType("varchar(256)").HasMaxLength(256);
                builder.Property(x => x.ConcurrencyStamp).HasColumnName("concurrency_stamp").HasColumnType("varchar(256)");
            });

            modelBuilder.Entity<Application>(builder =>
            {
                builder.ToTable("applications");

                builder.HasKey(x => x.Id).HasName("pk_applications");
                builder.HasIndex(x => x.ApplicationId).HasName("ix_applications_application_id").IsUnique();
                builder.HasIndex(x => x.Name).HasName("ix_applications_name").IsUnique();

                builder.Property(x => x.Id).HasColumnName("id").HasColumnType("bigint").IsRequired().ValueGeneratedNever();
                builder.Property(x => x.ApplicationId).HasColumnName("application_id").HasColumnType("varchar(50)").HasMaxLength(50).IsRequired();
                builder.Property(x => x.Name).HasColumnName("name").HasColumnType("varchar(50)").HasMaxLength(50).IsRequired();
                builder.Property(x => x.Description).HasColumnName("description").HasColumnType("varchar(250)").HasMaxLength(250);
                builder.Property(x => x.Enabled).HasColumnName("enabled").HasColumnType("boolean").IsRequired();
            });

            modelBuilder.Entity<Event>(builder =>
            {
                builder.ToTable("events");

                builder.HasKey(x => x.Id).HasName("pk_events");
                builder.HasIndex(x => x.GlobalId).HasName("ix_events_global_id");
                builder.HasIndex(x => new { x.ApplicationId, x.Category }).HasName("ix_events_application_id_category");
                builder.HasIndex(x => new { x.ApplicationId, x.Level }).HasName("ix_events_application_id_level");
                builder.HasIndex(x => new { x.ApplicationId, x.Level, x.TimeStamp }).HasName("ix_events_application_id_level_timestamp");
                builder.HasIndex(x => x.TimeStamp).HasName("ix_events_timestamp");

                builder.Property(x => x.Id).HasColumnName("id").HasColumnType("bigint").IsRequired().ValueGeneratedNever();
                builder.Property(x => x.GlobalId).HasColumnName("global_id").HasColumnType("bigint").IsRequired();
                builder.Property(x => x.ApplicationId).HasColumnName("application_id").HasColumnType("bigint").IsRequired();
                builder.Property(x => x.Category).HasColumnName("category").HasColumnType("varchar(500)").HasMaxLength(500).IsRequired();
                builder.Property(x => x.Level).HasColumnName("level").HasColumnType("varchar(50)").HasMaxLength(50).IsRequired();
                builder.Property(x => x.EventId).HasColumnName("event_id").HasColumnType("int").IsRequired();
                builder.Property(x => x.EventType).HasColumnName("event_type").HasColumnType("varchar(500)").HasMaxLength(500);
                builder.Property(x => x.Message).HasColumnName("message").HasColumnType("text").IsRequired();
                builder.Property(x => x.ProcessId).HasColumnName("process_id").HasColumnType("int").IsRequired();
                builder.Property(x => x.Exception).HasColumnName("exception").HasColumnType("text");
                builder.Property(x => x.TimeStamp).HasColumnName("timestamp").HasColumnType("timestamp").IsRequired();

                builder.HasOne(x => x.Application)
                    .WithMany(x => x.Events)
                    .HasForeignKey(x => x.ApplicationId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("fk_events_applications_application_id");
            });

            modelBuilder.Entity<UserApplication>(builder =>
            {
                builder.ToTable("user_applications");

                builder.HasKey(x => new { x.UserId, x.ApplicationId }).HasName("pk_user_applications");

                builder.Property(x => x.UserId).HasColumnName("user_id").HasColumnType("bigint").IsRequired();
                builder.Property(x => x.ApplicationId).HasColumnName("application_id").HasColumnType("bigint").IsRequired();

                builder.HasOne(x => x.Application)
                    .WithMany(x => x.Users)
                    .HasForeignKey(x => x.ApplicationId)
                    .HasConstraintName("fk_user_applications_applications_application_id");

                builder.HasOne(x => x.User)
                    .WithMany(x => x.Applications)
                    .HasForeignKey(x => x.UserId)
                    .HasConstraintName("fk_user_applications_users_user_id");
            });

            modelBuilder.Entity<FileMetadata>(builder =>
            {
                builder.ToTable("files");

                builder.HasKey(x => x.Id).HasName("pk_files");

                builder.Property(x => x.Id).HasColumnName("id").HasColumnType("bigint").IsRequired().ValueGeneratedNever();
                builder.Property(x => x.Filename).HasColumnName("filename").HasColumnType("varchar(255)").HasMaxLength(255).IsRequired();
                builder.Property(x => x.ContentType).HasColumnName("content_type").HasColumnType("varchar(50)").HasMaxLength(50).IsRequired();
                builder.Property(x => x.Size).HasColumnName("size").HasColumnType("int").IsRequired();
                builder.Property(x => x.RawName).HasColumnName("raw_name").HasColumnType("varchar(255)");
                builder.Property(x => x.Stream).HasColumnName("stream").HasColumnType("bytea");
            });

            modelBuilder.Entity<DeviceFlowCodes>(builder =>
            {
                builder.ToTable("device_codes");

                builder.HasKey(x => x.UserCode).HasName("pk_device_codes");
                builder.HasIndex(x => x.DeviceCode).IsUnique().HasName("ix_device_codes_device_code");
                builder.HasIndex(x => x.Expiration).HasName("ix_device_codes_expiration");

                builder.Property(x => x.UserCode).HasColumnName("user_code").HasColumnType("varchar(200)").HasMaxLength(200).IsRequired();
                builder.Property(x => x.DeviceCode).HasColumnName("device_code").HasColumnType("varchar(200)").HasMaxLength(200).IsRequired();
                builder.Property(x => x.SubjectId).HasColumnName("subject_id").HasColumnType("varchar(200)").HasMaxLength(200);
                builder.Property(x => x.ClientId).HasColumnName("client_id").HasColumnType("varchar(200)").HasMaxLength(200).IsRequired();
                builder.Property(x => x.CreationTime).HasColumnName("creation_time").HasColumnType("timestamp").IsRequired();
                builder.Property(x => x.Expiration).HasColumnName("expiration").HasColumnType("timestamp").IsRequired();
                builder.Property(x => x.Data).HasColumnName("data").HasColumnType("text").HasMaxLength(50000).IsRequired();
            });

            modelBuilder.Entity<PersistedGrant>(builder =>
            {
                builder.ToTable("persisted_grants");

                builder.HasKey(x => x.Key).HasName("pk_persisted_grants");
                builder.HasIndex(x => x.Expiration).HasName("ix_persisted_grants_expiration");
                builder.HasIndex(x => new { x.SubjectId, x.ClientId, x.Type }).HasName("ix_persisted_grants_subject_id_client_id_type");

                builder.Property(x => x.Key).HasColumnName("key").HasColumnType("varchar(200)").HasMaxLength(200).IsRequired();
                builder.Property(x => x.Type).HasColumnName("type").HasColumnType("varchar(50)").HasMaxLength(50).IsRequired();
                builder.Property(x => x.SubjectId).HasColumnName("subject_id").HasColumnType("varchar(200)").HasMaxLength(200);
                builder.Property(x => x.ClientId).HasColumnName("client_id").HasColumnType("varchar(200)").HasMaxLength(200).IsRequired();
                builder.Property(x => x.CreationTime).HasColumnName("creation_time").HasColumnType("timestamp").IsRequired();
                builder.Property(x => x.Expiration).HasColumnName("expiration").HasColumnType("timestamp");
                builder.Property(x => x.Data).HasColumnName("data").HasColumnType("text").HasMaxLength(50000).IsRequired();
            });

            modelBuilder.Entity<IdentityRoleClaim<long>>(builder =>
            {
                builder.ToTable("role_claims");

                builder.HasKey(x => x.Id).HasName("pk_role_claims");
                builder.HasIndex(x => x.RoleId).HasName("ix_role_claims_role_id");

                builder.Property(x => x.Id).HasColumnName("id").HasColumnType("int").IsRequired().ValueGeneratedOnAdd();
                builder.Property(x => x.RoleId).HasColumnName("role_id").HasColumnType("bigint").IsRequired();
                builder.Property(x => x.ClaimType).HasColumnName("claim_type").HasColumnType("varchar(500)").HasMaxLength(500);
                builder.Property(x => x.ClaimValue).HasColumnName("claim_value").HasColumnType("varchar(500)").HasMaxLength(500);

                builder.HasOne<Role>()
                    .WithMany()
                    .HasForeignKey(x => x.RoleId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("fk_role_claims_roles_role_id");
            });

            modelBuilder.Entity<IdentityUserClaim<long>>(builder =>
            {
                builder.ToTable("user_claims");

                builder.HasKey(x => x.Id).HasName("pk_user_claims");
                builder.HasIndex(x => x.UserId).HasName("ix_user_claims_user_id");

                builder.Property(x => x.Id).HasColumnName("id").HasColumnType("int").IsRequired().ValueGeneratedOnAdd();
                builder.Property(x => x.UserId).HasColumnName("user_id").HasColumnType("bigint").IsRequired();
                builder.Property(x => x.ClaimType).HasColumnName("claim_type").HasColumnType("varchar(500)").HasMaxLength(500);
                builder.Property(x => x.ClaimValue).HasColumnName("claim_value").HasColumnType("varchar(500)").HasMaxLength(500);

                builder.HasOne<User>()
                    .WithMany()
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("fk_user_claims_users_user_id");
            });

            modelBuilder.Entity<IdentityUserLogin<long>>(builder =>
            {
                builder.ToTable("user_logins");

                builder.HasKey(x => new { x.LoginProvider, x.ProviderKey }).HasName("pk_user_logins");

                builder.Property(x => x.LoginProvider).HasColumnName("login_provider").HasColumnType("varchar(500)").HasMaxLength(500).IsRequired();
                builder.Property(x => x.ProviderKey).HasColumnName("provider_key").HasColumnType("varchar(500)").HasMaxLength(500).IsRequired();
                builder.Property(x => x.ProviderDisplayName).HasColumnName("provider_display_name").HasColumnType("varchar(100)").HasMaxLength(100);
                builder.Property(x => x.UserId).HasColumnName("user_id").HasColumnType("bigint").IsRequired();

                builder.HasOne<User>()
                    .WithMany()
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("fk_user_logins_users_user_id");
            });

            modelBuilder.Entity<IdentityUserRole<long>>(builder =>
            {
                builder.ToTable("user_roles");

                builder.HasKey(x => new { x.UserId, x.RoleId }).HasName("pk_user_roles");

                builder.Property(x => x.UserId).HasColumnName("user_id").HasColumnType("bigint").IsRequired();
                builder.Property(x => x.RoleId).HasColumnName("role_id").HasColumnType("bigint").IsRequired();

                builder.HasOne<User>()
                    .WithMany()
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("fk_user_roles_users_user_id");

                builder.HasOne<Role>()
                    .WithMany()
                    .HasForeignKey(x => x.RoleId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("fk_user_roles_roles_role_id");
            });

            modelBuilder.Entity<IdentityUserToken<long>>(builder =>
            {
                builder.ToTable("user_tokens");

                builder.HasKey(x => new { x.UserId, x.LoginProvider, x.Name }).HasName("pk_user_tokens");

                builder.Property(x => x.UserId).HasColumnName("user_id").HasColumnType("bigint").IsRequired();
                builder.Property(x => x.LoginProvider).HasColumnName("login_provider").HasColumnType("varchar(500)").HasMaxLength(500).IsRequired();
                builder.Property(x => x.Name).HasColumnName("name").HasColumnType("varchar(500)").HasMaxLength(500).IsRequired();
                builder.Property(x => x.Value).HasColumnName("value").HasColumnType("varchar(500)").HasMaxLength(500);

                builder.HasOne<User>()
                    .WithMany()
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("fk_user_tokens_users_user_id");
            });
        }
    }

    public class PostgreSqlDbContextFactory : IDesignTimeDbContextFactory<PostgreSqlDbContext>
    {
        public PostgreSqlDbContext CreateDbContext(string[] args)
        {
            var configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddJsonFile("appsettings.json");
            configurationBuilder.AddUserSecrets(Assembly.GetAssembly(typeof(PostgreSqlDbContext)));
            var configuration = configurationBuilder.Build();

            var connectionString = configuration.GetConnectionString("PostgreSqlConnection");

            var optionsBuilder = new DbContextOptionsBuilder<PostgreSqlDbContext>();
            optionsBuilder.UseNpgsql(connectionString);

            var operationalStoreValue = new OperationalStoreOptions();
            // configuration.GetSection("OperationalStoreOptions").Bind(operationalStoreValue);
            var operationalStoreOptions = Options.Create(operationalStoreValue);

            return new PostgreSqlDbContext(optionsBuilder.Options,
                operationalStoreOptions,
                configuration);
        }
    }
}