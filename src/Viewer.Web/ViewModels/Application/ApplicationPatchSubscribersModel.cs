using System.ComponentModel.DataAnnotations;

namespace Viewer.Web.ViewModels.Application
{
    public class ApplicationPatchSubscribersModel
    {
        [Required]
        public long[] UserList { get; set; }
    }
}