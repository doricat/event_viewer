using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Viewer.Web.Data.Entities
{
    public class User : IdentityUser<long>
    {
        public string Name { get; set; }

        public long AvatarId { get; set; }

        public virtual ICollection<UserApplication> Applications { get; set; }
    }
}