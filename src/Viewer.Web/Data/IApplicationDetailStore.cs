using System;
using System.Threading.Tasks;
using Viewer.Web.Data.Entities;

namespace Viewer.Web.Data
{
    public interface IApplicationDetailStore : IApplicationStore
    {
        Task<Tuple<Application, int>> FindDetailByIdAsync(string id);
    }
}