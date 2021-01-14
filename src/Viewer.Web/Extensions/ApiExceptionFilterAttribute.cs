using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Viewer.Web.ApiModels;
using WebApi.Models;

namespace Viewer.Web.Extensions
{
    public class ApiExceptionFilterAttribute : ExceptionFilterAttribute
    {
        private readonly IHostEnvironment _environment;
        private readonly ILogger<ApiExceptionFilterAttribute> _logger;

        public ApiExceptionFilterAttribute(IHostEnvironment environment, ILogger<ApiExceptionFilterAttribute> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        public override async Task OnExceptionAsync(ExceptionContext context)
        {
            context.ExceptionHandled = true;
            _logger.LogError(context.Exception, "捕获到全局异常。");
            context.Result =
                new JsonResult(new ApiErrorResult<ApiError>(new ApiError(ApiErrorCodes.ServerError, "处理您的请求时发生错误，请稍后重试。")))
                {
                    StatusCode = 500
                };

            await base.OnExceptionAsync(context);
        }
    }
}