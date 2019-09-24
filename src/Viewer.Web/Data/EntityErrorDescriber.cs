namespace Viewer.Web.Data
{
    public class EntityErrorDescriber
    {
        public virtual EntityError DefaultError()
        {
            return new EntityError
            {
                Code = nameof(DefaultError),
                Description = "An unknown failure has occurred."
            };
        }

        public virtual EntityError ConcurrencyFailure()
        {
            return new EntityError
            {
                Code = nameof(ConcurrencyFailure),
                Description = "Optimistic concurrency failure, object has been modified."
            };
        }
    }
}