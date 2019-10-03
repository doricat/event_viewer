namespace Viewer.Web.ApiFilter
{
    public class BinaryExpressionNode : OperatingNode
    {
        public BinaryExpressionNode(string @operator, NodeType type) : base(@operator, type)
        {
        }
    }
}