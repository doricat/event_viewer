using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Viewer.Web.Data.Entities
{
    public class User : IdentityUser<long>
    {
        public string Name { get; set; }

        public string Avatar { get; set; }

        public virtual ICollection<UserApplication> Applications { get; set; }
    }
}