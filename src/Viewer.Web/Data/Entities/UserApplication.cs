namespace Viewer.Web.Data.Entities
{
    public class UserApplication
    {
        public long UserId { get; set; }

        public long ApplicationId { get; set; }

        public virtual User User { get; set; }

        public virtual Application Application { get; set; }
    }
}