using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Viewer.Web.Controllers.Account
{
    public class AccountPostModel
    {
        [Display(Name = "电子邮件")]
        [Required(ErrorMessage = "{0}不能为空")]
        [MaxLength(120, ErrorMessage = "{0}的最大长度不能大于{1}")]
        [RegularExpression(@"^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$", ErrorMessage = "{0}格式不正确")]
        public string Email { get; set; }

        [Display(Name = "密码")]
        [Required(ErrorMessage = "{0}不能为空")]
        [StringLength(16, MinimumLength = 6, ErrorMessage = "{0}的长度必须在{2}和{1}之间")]
        public string Password { get; set; }

        [Display(Name = "确认密码")]
        [Compare("Password", ErrorMessage = "{0}和{1}不匹配")]
        public string ConfirmPassword { get; set; }
    }

    public class AccountGetOutputModel
    {
        public long Id { get; set; }

        public string Email { get; set; }

        public string Name { get; set; }

        public string Avatar { get; set; }
    }

    public class UserPatchAvatarInputModel : IValidatableObject
    {
        [Display(Name = "头像文件")]
        [Required]
        public IFormFile File { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var result = new List<ValidationResult>();

            const int size = 512 * 1024;
            if (File.Length > size)
            {
                result.Add(new ValidationResult($"当前接口限制最大文件为{512}KB", new[] {nameof(File)}));
            }

            return result;
        }
    }
}