using Microsoft.Extensions.Hosting;

namespace Viewer.Web.Extensions
{
    public static class HostEnvironmentExtensions
    {
        public static bool IsDemo(this IHostEnvironment environment)
        {
            return environment.IsEnvironment("demo");
        }
    }
}