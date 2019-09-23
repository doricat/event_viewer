using System.Collections.Generic;

namespace Viewer.Web.Controllers.Application
{
    public class ApplicationDetailGetOutputModel : ApplicationGetOutputModel
    {
        public int EventCount { get; set; }

        public IList<long> UserList { get; set; }
    }
}