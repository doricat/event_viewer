using System.Reflection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Viewer.Web.Extensions;
using Viewer.Web.Extensions.Logging;

namespace Viewer.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((context, builder) =>
                {
                    if (context.HostingEnvironment.IsDemo())
                    {
                        builder.AddUserSecrets(Assembly.GetExecutingAssembly());
                    }
                })
                .ConfigureLogging((context, builder) =>
                {
                    if (context.HostingEnvironment.IsDevelopment())
                    {
                        builder.AddConsole();
                    }

                    builder.AddFakeLogger();
                })
                .ConfigureWebHostDefaults(builder => { builder.UseStartup<Startup>(); });
    }
}