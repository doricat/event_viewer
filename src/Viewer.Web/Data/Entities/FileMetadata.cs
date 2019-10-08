namespace Viewer.Web.Data.Entities
{
    public class FileMetadata
    {
        public long Id { get; set; }

        public string Filename { get; set; }

        public string ContentType { get; set; }

        public int Size { get; set; }

        public string RawName { get; set; }

        public byte[] Stream { get; set; }
    }
}