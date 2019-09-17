using Newtonsoft.Json;

namespace Viewer.Web.ApiModels
{
    public class InnerError
    {
        [JsonProperty("code")]
        public string Code { get; set; }

        [JsonProperty("innerError")]
        public InnerError InnerErrorObj { get; set; }

        // 其他属性
    }
}