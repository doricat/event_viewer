using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Data
{
    public class MyDbContext : IdentityDbContext<User, Role, long>
    {
        protected MyDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Application> Applications { get; set; }

        public DbSet<Event> Events { get; set; }

        public DbSet<FileMetadata> Files { get; set; }
    }
}