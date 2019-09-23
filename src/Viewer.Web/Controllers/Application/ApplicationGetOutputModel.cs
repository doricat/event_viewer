namespace Viewer.Web.Controllers.Application
{
    public class ApplicationGetOutputModel
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public string AppId { get; set; }

        public string Description { get; set; }

        public bool Enabled { get; set; }
    }
}