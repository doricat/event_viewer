using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Viewer.Web.ApiModels;
using WebApi.Models;

namespace Viewer.Web.Extensions
{
    public class OperationFilterAttribute : ActionFilterAttribute
    {
        private readonly IHostEnvironment _environment;
        private readonly IOptions<ApplicationSettings> _settings;
        private readonly ILogger<OperationFilterAttribute> _logger;

        public OperationFilterAttribute(IHostEnvironment environment, 
            IOptions<ApplicationSettings> settings, 
            ILogger<OperationFilterAttribute> logger)
        {
            _environment = environment;
            _settings = settings;
            _logger = logger;
        }

        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            if (_environment.IsDemo())
            {
                var requestMethod = context.HttpContext.Request.Method.ToLower();
                var controller = context.RouteData.Values["controller"].ToString().ToLower();
                var settings = _settings.Value;

                if (controller == "applications")
                {
                    if (requestMethod == "post")
                    {
                        LogWarning(requestMethod, context.HttpContext.Request.Path);
                        SetResult(context, "演示环境，不允许创建新的应用程序。");
                    }
                    else if (IsEditOperation(requestMethod))
                    {
                        var id = context.ActionArguments["id"] as string;
                        const string message = "不允许编辑和删除当前应用程序。";
                        if (long.TryParse(id, out var lId))
                        {
                            if (settings.CurrentApplicationId == lId)
                            {
                                LogWarning(requestMethod, context.HttpContext.Request.Path);
                                SetResult(context, message);
                            }
                        }
                        else
                        {
                            if (settings.CurrentApplicationCode == id)
                            {
                                LogWarning(requestMethod, context.HttpContext.Request.Path);
                                SetResult(context, message);
                            }
                        }
                    }
                }
                else if (controller == "accounts")
                {
                    if (IsEditOperation(requestMethod))
                    {
                        LogWarning(requestMethod, context.HttpContext.Request.Path);
                        SetResult(context, "演示环境，不允许编辑当前用户数据。");
                    }
                }
            }

            await base.OnActionExecutionAsync(context, next);
        }

        private void LogWarning(string requestMethod, string path)
        {
            _logger.LogWarning("尝试执行不支持的操作，[{method}]:/{path}", requestMethod, path);
        }

        private static void SetResult(ActionExecutingContext context, string message)
        {
            var result = new ApiErrorResult<ApiError>(new ApiError(ApiErrorCodes.BadArgument, message));
            context.Result = new BadRequestObjectResult(result);
        }

        private static bool IsEditOperation(string requestMethod)
        {
            return requestMethod == "put" || requestMethod == "patch" || requestMethod == "delete";
        }
    }
}