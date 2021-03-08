using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Viewer.Web.Services;

namespace Viewer.Web.Hubs
{
    [Authorize]
    public class EventHub : Hub<IEventClient>
    {
        private readonly IMonitorSettingsUpdatingQueue _monitorSettingsUpdatingQueue;

        public EventHub(IMonitorSettingsUpdatingQueue monitorSettingsUpdatingQueue)
        {
            _monitorSettingsUpdatingQueue = monitorSettingsUpdatingQueue;
        }

        public override Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var application = httpContext.Request.Query["application"];
            if (long.TryParse(application, out var applicationId))
            {
                _monitorSettingsUpdatingQueue.Enqueue(MonitorSettingDto.Add(applicationId, Context.ConnectionId));
            }

            return Task.CompletedTask;
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            var httpContext = Context.GetHttpContext();
            var application = httpContext.Request.Query["application"];
            if (long.TryParse(application, out var applicationId))
            {
                _monitorSettingsUpdatingQueue.Enqueue(MonitorSettingDto.Remove(applicationId, Context.ConnectionId));
            }

            return Task.CompletedTask;
        }
    }
}