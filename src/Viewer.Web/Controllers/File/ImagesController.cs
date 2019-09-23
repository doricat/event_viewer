using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Viewer.Web.Data;

namespace Viewer.Web.Controllers
{
    [Route("api/images")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        public ImagesController(ILogger<ImagesController> logger, FileManager fileManager)
        {
            Logger = logger;
            FileManager = fileManager;
        }

        public ILogger<ImagesController> Logger { get; }

        public FileManager FileManager { get; }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(long id)
        {
            var metadata = await FileManager.FindByIdAsync(id);
            if (metadata == null)
            {
                Logger.LogWarning($"找不到文件 {id}");
                return NotFound();
            }

            var file = System.IO.File.Open(metadata.Filename, FileMode.Open);
            return File(file, metadata.ContentType);
        }
    }
}