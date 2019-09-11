using System.Collections.Generic;

namespace Viewer.Web.Data.Entities
{
    public class Application
    {
        public string Id { get; set; }

        public string ApplicationId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public bool Enabled { get; set; }

        public virtual ICollection<Event> Events { get; set; }

        public virtual ICollection<UserApplication> Users { get; set; }
    }
}