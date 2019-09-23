using System.ComponentModel.DataAnnotations;

namespace Viewer.Web.Controllers.Application
{
    public class ApplicationPostModel
    {
        [Display(Name = "应用程序名称")]
        [Required(ErrorMessage = "{0}不能为空")]
        [StringLength(20, ErrorMessage = "{0}的长度必须小于{1}")]
        public string Name { get; set; }

        [Display(Name = "应用程序Id")]
        [Required(ErrorMessage = "{0}不能为空")]
        [StringLength(30, MinimumLength = 6, ErrorMessage = "{0}的长度必须在{2}和{1}之间")]
        [RegularExpression(@"^[a-zA-Z\d_]+$", ErrorMessage = "{0}只能包含字母数字和下划线")]
        public string Id { get; set; }

        [Display(Name = "描述")]
        [StringLength(250, ErrorMessage = "{0}的长度必须小于{1}")]
        public string Description { get; set; }

        public bool Enabled { get; set; }
    }
}