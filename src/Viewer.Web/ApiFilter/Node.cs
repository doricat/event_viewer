namespace Viewer.Web.ApiFilter
{
    public abstract class Node
    {
        protected Node(NodeType type)
        {
            Type = type;
        }

        public NodeType Type { get; set; }
    }
}