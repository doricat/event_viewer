using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Logging.WebSocket
{
    public class WebSocketLoggerConfigureOptions : IConfigureOptions<WebSocketLoggerOptions>
    {
        private readonly IConfiguration _configuration;
        private readonly string _isEnabledKey;

        public WebSocketLoggerConfigureOptions(IConfiguration configuration, string isEnabledKey)
        {
            _configuration = configuration;
            _isEnabledKey = isEnabledKey;
        }

        public void Configure(WebSocketLoggerOptions options)
        {
            options.IsEnabled = TextToBoolean(_configuration.GetSection(_isEnabledKey)?.Value);
        }

        private static bool TextToBoolean(string text)
        {
            if (string.IsNullOrEmpty(text) ||
                !bool.TryParse(text, out var result))
            {
                result = false;
            }

            return result;
        }
    }
}