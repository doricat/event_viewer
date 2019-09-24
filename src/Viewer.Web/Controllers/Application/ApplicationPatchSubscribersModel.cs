using System.ComponentModel.DataAnnotations;

namespace Viewer.Web.Controllers.Application
{
    public class ApplicationPatchSubscribersModel
    {
        [Required]
        public long[] UserList { get; set; }
    }
}