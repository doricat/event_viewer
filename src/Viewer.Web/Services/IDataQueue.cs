using System.Threading;
using System.Threading.Tasks;

namespace Viewer.Web.Services
{
    public interface IDataQueue
    {
        void Enqueue();

        Task DequeueAsync(CancellationToken cancellationToken);
    }

    public interface IDataQueue<T>
    {
        void Enqueue(T data);

        Task<T> DequeueAsync(CancellationToken cancellationToken);
    }
}