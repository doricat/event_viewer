using System;
using System.Runtime.Serialization;

namespace Viewer.Web.Extensions
{
    [Serializable]
    public class MyApplicationException : Exception
    {
        public MyApplicationException()
        {
        }

        public MyApplicationException(string message) : base(message)
        {
        }

        public MyApplicationException(string message, Exception inner) : base(message, inner)
        {
        }

        protected MyApplicationException(
            SerializationInfo info,
            StreamingContext context) : base(info, context)
        {
        }

        /// <summary>
        /// Data.Key = IdentityErrors
        /// </summary>
        /// <param name="errors"></param>
        public void SetIdentityErrors(object errors)
        {
            Data.Add("IdentityErrors", errors);
        }
    }
}