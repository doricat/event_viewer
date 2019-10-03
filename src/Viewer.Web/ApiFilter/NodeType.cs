namespace Viewer.Web.ApiFilter
{
    public enum NodeType : byte
    {
        None,
        UnaryLogicalExpression,
        BinaryLogicalExpression,
        RelationalExpression,
        Property,
        Constant
    }
}