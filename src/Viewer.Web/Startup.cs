using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Viewer.Web.Data;
using Viewer.Web.Data.Entities;
using Viewer.Web.Extensions;
using Viewer.Web.Hubs;
using Viewer.Web.Infrastructure;
using Viewer.Web.Services;
using Viewer.Web.Utilities;

namespace Viewer.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IHostEnvironment hostEnvironment)
        {
            Configuration = configuration;
            HostEnvironment = hostEnvironment;
        }

        public IConfiguration Configuration { get; }

        public IHostEnvironment HostEnvironment { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            var databaseEnvironment = new MyDatabaseEnvironment(Environment.GetEnvironmentVariable("DATABASE_ENVIRONMENT"));

            services.AddControllersWithViews(options =>
                {
                    options.Filters.Add<ApiModelStateCheckFilterAttribute>();
                    options.Filters.Add<ApiExceptionFilterAttribute>();
                }).ConfigureApiBehaviorOptions(options => { options.SuppressModelStateInvalidFilter = true; })
                .SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
            services.AddRazorPages();

            if (databaseEnvironment.IsPostgreSQL())
            {
                services.AddDbContext<MyDbContext, PostgreSqlDbContext>(ServiceLifetime.Scoped);
                services.AddIdentity<User, Role>().AddEntityFrameworkStores<PostgreSqlDbContext>();
                services.AddIdentityServer().AddApiAuthorization<User, PostgreSqlDbContext>().AddProfileService<ProfileService>();
            }
            else if (databaseEnvironment.IsSQLite())
            {
                services.AddDbContext<MyDbContext, SqliteDbContext>(ServiceLifetime.Scoped);
                services.AddIdentity<User, Role>().AddEntityFrameworkStores<SqliteDbContext>();
                services.AddIdentityServer().AddApiAuthorization<User, SqliteDbContext>().AddProfileService<ProfileService>();
            }

            services.AddAuthentication().AddIdentityServerJwt().AddJwtBearer(options =>
            {
                options.Events.OnAuthenticationFailed = context =>
                {
                    context.Response.StatusCode = 401;
                    return Task.CompletedTask;
                };

                options.Events.OnForbidden = context => Task.CompletedTask;
            });

            services.AddMemoryCache();
            services.AddSignalR();

            services.AddSingleton<IdentityGenerator>();
            services.AddScoped<EntityErrorDescriber>();

            services.Configure<IdentityGeneratorOptions>(x => x.InstanceTag = 1);
            services.Configure<LocalFileStorageServiceOptions>(x => x.RootDirectory = Configuration.GetValue<string>("FileUploadRootDirectory"));
            services.Configure<ApplicationSettings>(x => Configuration.GetSection("ApplicationSettings").Bind(x));
            services.Configure<ApplicationEnvironment>(environment => environment.DatabaseEnvironment = databaseEnvironment);

            services.AddStores(databaseEnvironment).AddManagers();
            services.AddMyHostedService(databaseEnvironment);
            services.AddTransient<IEmailSender, FakeEmailSender>();
            services.AddScoped<OperationFilterAttribute>();
        }

        public void Configure(IApplicationBuilder app, IHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthentication();
            app.UseIdentityServer();
            app.UseAuthorization();

            app.UseEndpoints(builder =>
            {
                builder.MapHub<EventHub>("/hub/event");
                builder.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                builder.MapRazorPages();
            });

            if (!env.IsProduction())
            {
                app.UseSpa(builder => { builder.UseProxyToSpaDevelopmentServer("http://localhost:3000"); });
            }
        }
    }
}