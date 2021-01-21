using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Viewer.Web.Data;

namespace Viewer.Web.Controllers
{
    public class EventController : Controller
    {
        private readonly EventManager _eventManager;

        public EventController(EventManager eventManager)
        {
            _eventManager = eventManager;
        }

        public async Task<IActionResult> Index(long id)
        {
            var evt = await _eventManager.Store.FindByIdAsync(id);
            if (evt == null)
            {
                return NotFound();
            }

            return View(evt);
        }
    }
}