using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace Viewer.Web.Data
{
    public class LocalFileStorageService
    {
        public LocalFileStorageService(IOptionsMonitor<LocalFileStorageServiceOptions> options)
        {
            Options = options.CurrentValue;
        }

        public LocalFileStorageServiceOptions Options { get; }

        public async Task<string> SaveAsync(Stream stream)
        {
            var directory = await SelectDirectoryAsync();
            var fileName = Path.Combine(directory, Path.GetRandomFileName()).Replace("\\", "/");
            using (var file = File.Create(fileName))
            {
                stream.Seek(0, SeekOrigin.Begin);
                await stream.CopyToAsync(file);
            }

            return fileName;
        }

        private Task<string> SelectDirectoryAsync()
        {
            var path = Options.RootDirectory;

            if (string.IsNullOrWhiteSpace(path))
            {
                throw new InvalidOperationException();
            }

            var dir = path.StartsWith(".") ? Path.GetFullPath(path) : path;

            if (!Directory.Exists(dir))
                Directory.CreateDirectory(dir);
            return Task.FromResult(dir);
        }
    }
}