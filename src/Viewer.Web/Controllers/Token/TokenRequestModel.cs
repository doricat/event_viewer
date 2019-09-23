using System.ComponentModel.DataAnnotations;

namespace Viewer.Web.Controllers.Token
{
    public class TokenRequestModel
    {
        [Display(Name = "用户名")]
        [Required(ErrorMessage = "{0}不能为空")]
        [MaxLength(120, ErrorMessage = "{0}的最大长度不能大于{1}")]
        public string Username { get; set; }

        [Display(Name = "密码")]
        [Required(ErrorMessage = "{0}不能为空")]
        [MaxLength(16, ErrorMessage = "{0}的最大长度不能大于{1}")]
        public string Password { get; set; }
    }
}