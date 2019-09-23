using System.Collections.Generic;
using System.Linq;

namespace Viewer.Web.Data
{
    public class EntityResult
    {
        private readonly List<EntityError> _errors = new List<EntityError>();

        public bool Succeeded { get; protected set; }

        public IList<EntityError> Errors { get; } = new List<EntityError>();

        public static EntityResult Success { get; } = new EntityResult {Succeeded = true};

        public static EntityResult Failed(params EntityError[] errors)
        {
            var result = new EntityResult {Succeeded = false};
            if (errors != null)
            {
                result._errors.AddRange(errors);
            }

            return result;
        }

        public override string ToString()
        {
            return Succeeded ? "Succeeded" : $"Failed : {string.Join(",", Errors.Select(x => x.Code).ToList())}";
        }
    }
}