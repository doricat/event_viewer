using System.ComponentModel.DataAnnotations;

namespace Viewer.Web.ViewModels.Account
{
    public class AccountPostModel
    {
        [Display(Name = "电子邮件")]
        [Required(ErrorMessage = "{0}不能为空")]
        [MaxLength(120, ErrorMessage = "{0}的最大长度不能大于{1}")]
        [RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", ErrorMessage = "{0}格式不正确")]
        public string Email { get; set; }

        [Display(Name = "密码")]
        [Required(ErrorMessage = "{0}不能为空")]
        [StringLength(16, MinimumLength = 6, ErrorMessage = "{0}的长度必须在{2}和{1}之间")]
        public string Password { get; set; }

        [Display(Name = "确认密码")]
        [Compare("Password", ErrorMessage = "{0}和{1}不匹配")]
        public string ConfirmPassword { get; set; }

        [Display(Name = "名称")]
        [Required(ErrorMessage = "{0}不能为空")]
        [MaxLength(20, ErrorMessage = "{0}的最大长度不能大于{1}")]
        public string Name { get; set; }
    }
}