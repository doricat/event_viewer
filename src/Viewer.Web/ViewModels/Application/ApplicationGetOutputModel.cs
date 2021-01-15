namespace Viewer.Web.ViewModels.Application
{
    public class ApplicationGetOutputModel
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public string ApplicationId { get; set; }

        public string Description { get; set; }

        public bool Enabled { get; set; }
    }
}