using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Viewer.Web.Data;
using Viewer.Web.Data.Entities;
using Viewer.Web.Extensions;
using Viewer.Web.Hubs;
using Viewer.Web.Services;
using Viewer.Web.Utilities;

namespace Viewer.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc(options =>
            {
                options.Filters.Add<ApiModelStateCheckFilterAttribute>();
                options.Filters.Add<ApiExceptionFilterAttribute>();
            }).ConfigureApiBehaviorOptions(options => { options.SuppressModelStateInvalidFilter = true; }).SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/build"; });

            services.AddDbContext<ApplicationDbContext>(builder => builder.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
            services.AddIdentity<User, Role>().AddEntityFrameworkStores<ApplicationDbContext>();

            var secret = Configuration.GetValue<string>("Secret");
            services.Configure<SecretOptions>(x => x.Secret = secret);

            var key = Encoding.ASCII.GetBytes(secret);
            services.AddAuthentication(x =>
                {
                    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(x =>
                {
                    x.RequireHttpsMetadata = false;
                    x.SaveToken = true;
                    x.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };

                    x.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];
                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/EventHub"))
                            {
                                context.Token = accessToken;
                            }

                            return Task.CompletedTask;
                        }
                    };
                });

            services.AddCors(options => options.AddPolicy("CorsPolicy",
                builder =>
                {
                    builder.AllowAnyMethod()
                        .AllowAnyHeader()
                        .WithOrigins("http://localhost:13001")
                        .AllowCredentials();
                }));

            services.Configure<IdentityGeneratorOptions>(x => x.MachineTag = 1);
            services.AddSingleton<IdentityGenerator>();
            services.AddScoped<ApplicationManager>();
            services.AddScoped<EntityErrorDescriber>();
            services.AddScoped<IApplicationStore, ApplicationStore>();

            services.Configure<LocalFileStorageServiceOptions>(x => Configuration.GetValue<string>("FileUploadRootDirectory"));
            services.AddScoped<IFileStore, FileStore>();
            services.AddScoped<LocalFileStorageService>();
            services.AddScoped<FileManager>();

            services.AddScoped<IEventStore, EventStore>();
            services.AddScoped<EventManager>();

            services.AddMyHostedService();

            services.Configure<PrimarySettings>(x => Configuration.GetSection("PrimarySettings").Bind(x));

            services.AddSignalR();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseAuthentication();

            app.UseCors("CorsPolicy");

            app.UseSignalR(routes => { routes.MapHub<EventHub>("/EventHub"); });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    // spa.UseReactDevelopmentServer(npmScript: "start");
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:13001");
                }
            });
        }
    }
}