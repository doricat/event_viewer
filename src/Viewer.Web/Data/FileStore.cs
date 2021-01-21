using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Data
{
    public class FileStore : IFileStore
    {
        public FileStore(MyDbContext dbContext, EntityErrorDescriber errorDescriber)
        {
            DbContext = dbContext;
            ErrorDescriber = errorDescriber;
        }

        public MyDbContext DbContext { get; }

        protected DbSet<FileMetadata> Files => DbContext.Files;

        protected EntityErrorDescriber ErrorDescriber { get; }

        public async Task<FileMetadata> FindByIdAsync(long id)
        {
            return await Files.FindAsync(id);
        }

        public async Task<EntityResult> SaveFileMetadataAsync(FileMetadata metadata, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();
            if (metadata == null) throw new ArgumentNullException(nameof(metadata));

            DbContext.Add(metadata);

            try
            {
                await DbContext.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateConcurrencyException)
            {
                return EntityResult.Failed(ErrorDescriber.ConcurrencyFailure());
            }

            return EntityResult.Success;
        }
    }
}