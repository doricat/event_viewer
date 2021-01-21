using System.ComponentModel.DataAnnotations;

namespace Viewer.Web.ViewModels.Account
{
    public class AccountPasswordPatchModel
    {
        [Display(Name = "当前密码")]
        [Required(ErrorMessage = "{0}不能为空")]
        [StringLength(16, MinimumLength = 6, ErrorMessage = "{0}的长度必须在{2}和{1}之间")]
        public string CurrentPassword { get; set; }

        [Display(Name = "密码")]
        [Required(ErrorMessage = "{0}不能为空")]
        [StringLength(16, MinimumLength = 6, ErrorMessage = "{0}的长度必须在{2}和{1}之间")]
        public string Password { get; set; }

        [Display(Name = "确认密码")]
        [Compare("Password", ErrorMessage = "{0}和{1}不匹配")]
        public string ConfirmPassword { get; set; }
    }
}