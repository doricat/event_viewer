using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Viewer.Web.ApiModels;

namespace Viewer.Web.Extensions
{
    public class ApiExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public ApiExceptionFilterAttribute(IHostingEnvironment environment, ILogger<ApiExceptionFilterAttribute> logger)
        {
            Environment = environment;
            Logger = logger;
        }

        public IHostingEnvironment Environment { get; }

        public ILogger Logger { get; }

        public override async Task OnExceptionAsync(ExceptionContext context)
        {
            context.ExceptionHandled = true;
            Logger.LogError(context.Exception, "捕获到全局异常。");
            context.Result = new ContentResult
            {
                StatusCode = (int) HttpStatusCode.InternalServerError,
                Content = JsonConvert.SerializeObject(new ApiErrorResult<ApiError>(new ApiError(ApiErrorCodes.ServerError, "处理您的请求时发生错误，请稍后重试。")),
                    new JsonSerializerSettings {NullValueHandling = NullValueHandling.Ignore}),
                ContentType = "application/json"
            };

            await base.OnExceptionAsync(context);
        }
    }
}