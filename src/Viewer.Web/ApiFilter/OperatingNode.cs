using System.Collections.Generic;

namespace Viewer.Web.ApiFilter
{
    public abstract class OperatingNode : Node
    {
        protected OperatingNode(string @operator, NodeType type) : base(type)
        {
            Operator = @operator;
        }

        public string Operator { get; set; }

        public IList<Node> Params { get; set; } = new List<Node>();

        public override string ToString()
        {
            return $"NodeType: {Type}, Operator: {Operator}";
        }
    }
}