using Newtonsoft.Json;

namespace Viewer.Web.ApiModels
{
    public class ApiResult<T>
    {
        public ApiResult()
        {
        }

        public ApiResult(T value)
        {
            Value = value;
        }

        [JsonProperty("value")]
        public T Value { get; set; }
    }
}