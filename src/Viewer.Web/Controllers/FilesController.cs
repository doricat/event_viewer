using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Viewer.Web.Data;

namespace Viewer.Web.Controllers
{
    [Route("api/files")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly ILogger<FilesController> _logger;
        private readonly FileManager _fileManager;

        public FilesController(ILogger<FilesController> logger, FileManager fileManager)
        {
            _logger = logger;
            _fileManager = fileManager;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(long id)
        {
            var metadata = await _fileManager.FindByIdAsync(id);
            if (metadata == null)
            {
                _logger.LogWarning($"找不到文件 {id}");
                return NotFound();
            }

            if (metadata.Stream != null)
            {
                return File(metadata.Stream, metadata.ContentType);
            }

            return PhysicalFile(metadata.Filename, metadata.ContentType);
        }
    }
}