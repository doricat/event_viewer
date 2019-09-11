using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Logging.WebSocket
{
    internal class WebSocketLoggerOptionsSetup : ConfigureFromConfigurationOptions<WebSocketLoggerOptions>
    {
        public WebSocketLoggerOptionsSetup(IConfiguration config) : base(config)
        {
            Configuration = config;
        }

        public IConfiguration Configuration { get; }

        public override void Configure(WebSocketLoggerOptions options)
        {
            Configuration.GetSection("WebSocketLoggerOptions").Bind(options);
        }
    }
}