using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Viewer.Web.Extensions.Logging
{
    public class FakeLoggerOptionsSetup : ConfigureFromConfigurationOptions<FakeLoggerOptions>
    {
        public FakeLoggerOptionsSetup(IConfiguration config) : base(config)
        {
            Configuration = config;
        }

        public IConfiguration Configuration { get; }

        public override void Configure(FakeLoggerOptions options)
        {
            Configuration.GetSection("FakeLoggerOptions").Bind(options);
        }
    }
}