using System.Collections.Generic;
using Newtonsoft.Json;

namespace Viewer.Web.ApiModels
{
    public class ApiError
    {
        public ApiError(string code, string message)
        {
            Code = code;
            Message = message;
        }

        [JsonRequired]
        [JsonProperty("code")]
        public string Code { get; set; }

        [JsonRequired]
        [JsonProperty("message")]
        public string Message { get; set; }

        [JsonProperty("target", NullValueHandling = NullValueHandling.Ignore)]
        public string Target { get; set; }

        [JsonProperty("details", NullValueHandling = NullValueHandling.Ignore)]
        public IList<ApiError> Details { get; set; }

        [JsonProperty("innerError", NullValueHandling = NullValueHandling.Ignore)]
        public InnerError InnerError { get; set; }
    }
}
