namespace Viewer.Web.ApiFilter
{
    public struct Token
    {
        public Token(FilterTokenType tokenType, string value, int? index)
        {
            TokenType = tokenType;
            Value = value;
            Index = index;
        }

        public FilterTokenType TokenType { get; }

        public string Value { get; }

        public int? Index { get; }

        public override string ToString()
        {
            return $"Value: {Value}, Type: {TokenType}, Index: {Index}";
        }
    }
}