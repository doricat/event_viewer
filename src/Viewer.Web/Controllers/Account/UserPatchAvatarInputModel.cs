using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Viewer.Web.Controllers.Account
{
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