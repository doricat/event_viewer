namespace Viewer.Web.Data
{
    public class EntityErrorDescriber
    {
        public virtual EntityError DefaultError()
        {
            return new EntityError
            {
                Code = nameof(DefaultError),
                Description = ""
            };
        }

        public virtual EntityError ConcurrencyFailure()
        {
            return new EntityError
            {
                Code = nameof(ConcurrencyFailure),
                Description = ""
            };
        }
    }
}