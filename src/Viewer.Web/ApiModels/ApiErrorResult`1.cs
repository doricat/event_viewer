using Newtonsoft.Json;

namespace Viewer.Web.ApiModels
{
    public class ApiErrorResult<T>
    {
        public ApiErrorResult()
        {
        }

        public ApiErrorResult(T error)
        {
            Error = error;
        }

        [JsonProperty("error")]
        public T Error { get; set; }
    }
}