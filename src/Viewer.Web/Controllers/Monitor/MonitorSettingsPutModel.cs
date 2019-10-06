using System.ComponentModel.DataAnnotations;

namespace Viewer.Web.Controllers.Monitor
{
    public class MonitorSettingsPutModel
    {
        [Display(Name = "应用程序Id")]
        [Required]
        public long AppId { get; set; }

        [Display(Name = "事件级别")]
        [Required]
        [RegularExpression(@"^-?(critical|error|warning|information|debug|trace)$")]
        public string Level { get; set; }

        public override string ToString()
        {
            return $"Application: {AppId}, Level: {Level}";
        }
    }
}