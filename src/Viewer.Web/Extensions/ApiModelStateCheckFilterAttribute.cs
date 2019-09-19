using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using Viewer.Web.ApiModels;

namespace Viewer.Web.Extensions
{
    public class ApiModelStateCheckFilterAttribute : ActionFilterAttribute
    {
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            if (!context.ModelState.IsValid)
            {
                var detail = context.ModelState.Where(x => x.Value.Errors.Any())
                    .ToDictionary(x => x.Key[0].ToString().ToLower() + x.Key.Substring(1), x => x.Value.Errors.First().ErrorMessage);

                var result = new ApiError(ApiErrorCodes.BadArgument, "错误的参数")
                {
                    Details = detail.Select(x => new ApiError(ApiErrorCodes.BadArgument, x.Value) {Target = x.Key}).ToList()
                };
                if (!result.Details.Any())
                {
                    result.Target = context.ActionDescriptor.Parameters.FirstOrDefault()?.Name ?? "model";
                }

                context.Result = new ContentResult
                {
                    StatusCode = 400,
                    Content = JsonConvert.SerializeObject(new ApiErrorResult<ApiError>(result),
                        new JsonSerializerSettings {NullValueHandling = NullValueHandling.Ignore}),
                    ContentType = "application/json"
                };
            }

            await base.OnActionExecutionAsync(context, next);
        }
    }
}