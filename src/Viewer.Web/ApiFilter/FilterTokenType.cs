namespace Viewer.Web.ApiFilter
{
    public enum FilterTokenType : byte
    {
        None,
        PropertyName,
        StartGrouping,
        EndGrouping,
        UnaryLogicalOperator,
        BinaryLogicalOperator,
        RelationalOperator,
        String,
        Number,
        True,
        False,
        Null,
        ExprEnd
    }
}