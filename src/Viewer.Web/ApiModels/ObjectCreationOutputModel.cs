namespace Viewer.Web.ApiModels
{
    public class ObjectCreationOutputModel<TKey>
    {
        public ObjectCreationOutputModel()
        {
        }

        public ObjectCreationOutputModel(TKey id, string location)
        {
            Id = id;
            Location = location;
        }

        public TKey Id { get; set; }

        public string Location { get; set; }
    }
}