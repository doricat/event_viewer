using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Viewer.Web.Data.Entities;
using Viewer.Web.Utilities;

namespace Viewer.Web.Data
{
    public class FileManager
    {
        public FileManager(ILogger<FileManager> logger, IFileStore fileStore, IdentityGenerator identityGenerator, IHttpContextAccessor httpContextAccessor, LocalFileStorageService fileStorageService)
        {
            Logger = logger;
            FileStore = fileStore;
            IdentityGenerator = identityGenerator;
            HttpContextAccessor = httpContextAccessor;
            FileStorageService = fileStorageService;
        }

        public ILogger<FileManager> Logger { get; }

        public IFileStore FileStore { get; }

        public IdentityGenerator IdentityGenerator { get; }

        public IHttpContextAccessor HttpContextAccessor { get; }

        public LocalFileStorageService FileStorageService { get; }

        public async Task<FileMetadata> FindByIdAsync(long id)
        {
            return await FileStore.FindByIdAsync(id);
        }

        public async Task<long> CreateFileAsync(Stream stream, string contentType, string inputName)
        {
            var fileName = await FileStorageService.SaveAsync(stream);
            var metadata = new FileMetadata
            {
                Id = await IdentityGenerator.GenerateAsync(),
                ContentType = contentType.ToLower(),
                Size = (int) stream.Length,
                Filename = fileName,
                RawName = inputName
            };

            await FileStore.SaveFileMetadataAsync(metadata, HttpContextAccessor.HttpContext.RequestAborted);
            return metadata.Id;
        }
    }
}