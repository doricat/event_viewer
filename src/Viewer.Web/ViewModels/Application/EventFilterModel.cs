using System;
using System.ComponentModel.DataAnnotations;

namespace Viewer.Web.ViewModels.Application
{
    public class EventFilterModel
    {
        [Display(Name = "事件级别")]
        [RegularExpression(@"^critical|error|warning|information|debug|trace$")]
        public string Level { get; set; }

        [Display(Name = "时间")]
        [Range(typeof(DateTime), "2019/01/01", "2029/12/31 23:59:59")]
        public DateTime Timestamp { get; set; }
    }
}