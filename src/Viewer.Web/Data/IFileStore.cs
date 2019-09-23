using System.Threading;
using System.Threading.Tasks;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Data
{
    public interface IFileStore
    {
        Task<FileMetadata> FindByIdAsync(long id);

        Task<EntityResult> SaveFileMetadataAsync(FileMetadata metadata, CancellationToken cancellationToken);
    }
}