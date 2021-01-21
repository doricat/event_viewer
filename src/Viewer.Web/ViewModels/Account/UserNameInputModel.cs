using System.ComponentModel.DataAnnotations;

namespace Viewer.Web.ViewModels.Account
{
    public class UserNameInputModel
    {
        [Display(Name = "姓名")]
        [Required]
        [MaxLength(10)]
        public string Name { get; set; }
    }
}