using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Viewer.Web.Extensions;

namespace Viewer.Web.ViewModels.Account
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

            if (!FormFileExtensions.ContentTypes.Contains(File.ContentType))
            {
                result.Add(new ValidationResult("仅支持jpeg和png文件", new[] {nameof(File)}));
            }

            return result;
        }
    }
}