namespace Viewer.Web.Infrastructure
{
    public class ApplicationSettings
    {
        public long DefaultAvatar { get; set; }

        public long CurrentApplicationId { get; set; }

        public string CurrentApplicationCode { get; set; }

        public int EventFlushPeriod { get; set; } = 5;

        public int? EventStoragePeriod { get; set; }
    }
}