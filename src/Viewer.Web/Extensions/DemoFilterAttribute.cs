using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Viewer.Web.ApiModels;

namespace Viewer.Web.Extensions
{
    public class DemoFilterAttribute : ActionFilterAttribute
    {
        public DemoFilterAttribute(IHostingEnvironment environment, ILogger<DemoFilterAttribute> logger, IOptionsMonitor<PrimarySettings> primarySettings)
        {
            Environment = environment;
            Logger = logger;
            PrimarySettings = primarySettings.CurrentValue;
        }

        public IHostingEnvironment Environment { get; }

        public ILogger<DemoFilterAttribute> Logger { get; }

        public PrimarySettings PrimarySettings { get; }

        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            if (Environment.IsEnvironment("demo"))
            {
                var requestMethod = context.HttpContext.Request.Method.ToLower();
                var controller = context.RouteData.Values["controller"].ToString().ToLower();

                if (controller == "applications")
                {
                    if (requestMethod == "post")
                    {
                        SetResult(context, "演示环境，不允许创建新的应用程序。");
                    }
                    else if (requestMethod == "put" || requestMethod == "patch" || requestMethod == "delete")
                    {
                        var id = context.ActionArguments["id"] as string;
                        const string message = "演示环境，不允许编辑和删除当前应用程序。";
                        if (long.TryParse(id, out var lId))
                        {
                            if (PrimarySettings.CurrentApplicationId == lId)
                            {
                                SetResult(context, message);
                            }
                        }
                        else
                        {
                            if (PrimarySettings.CurrentApplicationCode == id)
                            {
                                SetResult(context, message);
                            }
                        }
                    }
                }
                else if (controller == "accounts")
                {
                    if (requestMethod == "post")
                    {
                        SetResult(context, "演示环境，不允许注册新的用户。");
                    }
                    else if (requestMethod == "put" || requestMethod == "patch" || requestMethod == "delete")
                    {
                        SetResult(context, "演示环境，不允许编辑当前用户数据。");
                    }
                }
            }

            await base.OnActionExecutionAsync(context, next);
        }

        private static void SetResult(ActionExecutingContext context, string message)
        {
            var result = new ApiErrorResult<ApiError>(new ApiError(ApiErrorCodes.BadArgument, message));
            context.Result = new BadRequestObjectResult(result);
        }
    }
}