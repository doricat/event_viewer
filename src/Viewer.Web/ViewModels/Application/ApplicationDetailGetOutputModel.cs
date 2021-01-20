using System.Collections.Generic;
using System.Linq;

namespace Viewer.Web.ViewModels.Application
{
    public class ApplicationDetailGetOutputModel : ApplicationGetOutputModel
    {
        public int EventCount { get; set; }

        public IList<long> UserList { get; set; }

        public static ApplicationDetailGetOutputModel FromApplication(Data.Entities.Application app, int eventCount)
        {
            return new ApplicationDetailGetOutputModel
            {
                Id = app.Id,
                ApplicationId = app.ApplicationId,
                Name = app.Name,
                Enabled = app.Enabled,
                Description = app.Description,
                EventCount = eventCount,
                UserList = app.Users.Select(x => x.UserId).ToList()
            };
        }
    }
}