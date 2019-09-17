using System.Collections.Generic;
using Newtonsoft.Json;

namespace Viewer.Web.ApiModels
{
    public class PagedResult<T> : ApiResult<T>
    {
        public PagedResult(T value) : base(value)
        {
        }

        [JsonProperty("nextLink", NullValueHandling = NullValueHandling.Ignore)]
        public string NextLink { get; set; }

        [JsonProperty("sorts", NullValueHandling = NullValueHandling.Ignore)]
        public IList<string> Sorts { get; set; }

        [JsonProperty("count", NullValueHandling = NullValueHandling.Ignore)]
        public int? Count { get; set; }

        [JsonProperty("maxPageSize", NullValueHandling = NullValueHandling.Ignore)]
        public int? MaxPageSize { get; set; }
    }
}