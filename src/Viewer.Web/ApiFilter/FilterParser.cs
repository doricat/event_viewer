using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Viewer.Web.ApiFilter
{
    public class FilterParser
    {
        private readonly TokenReader _reader;

        public FilterParser(IList<Token> tokens, IList<PropertyInfo> propertyInfos)
        {
            Tokens = tokens;
            PropertyInfos = propertyInfos;
            _reader = new TokenReader(tokens);
        }

        public IList<Token> Tokens { get; }

        public IList<PropertyInfo> PropertyInfos { get; }

        public Node Parse()
        {
            if (!Tokens.Any())
            {
                return null;
            }

            if (Tokens.Last().TokenType != FilterTokenType.ExprEnd)
            {
                Tokens.Add(new Token(FilterTokenType.ExprEnd, null, null));
            }

            return ParseExpression();
        }

        private Node ParseExpression()
        {
            var left = ParseTerm();
            while (true)
            {
                var token = _reader.Peek();
                if (token.TokenType == FilterTokenType.ExprEnd)
                {
                    break;
                }

                if (token.TokenType != FilterTokenType.BinaryLogicalOperator)
                {
                    break;
                }

                token = _reader.Read();
                var right = ParseTerm();
                var node = new BinaryExpressionNode(token.Value, NodeType.BinaryLogicalExpression);
                node.Params.Add(left);
                node.Params.Add(right);
                left = node;
            }

            if (!(left is BinaryExpressionNode) && !(left is UnaryExpressionNode))
            {
                throw new FilterException("表达式语法错误。");
            }

            return left;
        }

        private Node ParseTerm()
        {
            var left = ParsePrimaryExpression();
            while (true)
            {
                var token = _reader.Peek();
                if (token.TokenType == FilterTokenType.ExprEnd)
                {
                    break;
                }

                if (token.TokenType != FilterTokenType.RelationalOperator)
                {
                    break;
                }

                token = _reader.Read();
                var next = _reader.Peek();
                if (next.TokenType != FilterTokenType.String &&
                    next.TokenType != FilterTokenType.Number &&
                    next.TokenType != FilterTokenType.True &&
                    next.TokenType != FilterTokenType.False &&
                    next.TokenType != FilterTokenType.Null)
                {
                    break;
                }

                var right = ParsePrimaryExpression();

                if (left is PropertyNode propertyNode)
                {
                    var constantNode = (ConstantNode) right;
                    SetConstantValue(propertyNode.PropertyType, propertyNode.Name, constantNode.Value.ToString(), constantNode);
                    propertyNode.BoundValue = constantNode.Value;
                }

                var node = new BinaryExpressionNode(token.Value, NodeType.RelationalExpression);
                node.Params.Add(left);
                node.Params.Add(right);
                return node;
            }

            if (!(left is BinaryExpressionNode) && !(left is UnaryExpressionNode))
            {
                throw new FilterException("表达式语法错误。");
            }

            return left;
        }

        private Node ParsePrimaryExpression()
        {
            var token = _reader.Read();
            switch (token.TokenType)
            {
                case FilterTokenType.UnaryLogicalOperator:
                {
                    var node = new UnaryExpressionNode(token.Value, NodeType.UnaryLogicalExpression);
                    token = _reader.Read();
                    if (token.TokenType == FilterTokenType.StartGrouping)
                    {
                        var right = ParseExpression();
                        token = _reader.Read();
                        if (token.TokenType != FilterTokenType.EndGrouping)
                        {
                            throw new FilterException("表达式包含未关闭的括号。");
                        }

                        node.Params.Add(right);
                        return node;
                    }

                    throw new FilterException("语法错误，not运算符的参数应该包含在括号中。");
                }
                case FilterTokenType.StartGrouping:
                {
                    var next = _reader.Peek();
                    if (next.TokenType == FilterTokenType.EndGrouping)
                    {
                        _reader.Read();
                        return ParseExpression();
                    }

                    var node = ParseExpression();
                    token = _reader.Read();
                    if (token.TokenType != FilterTokenType.EndGrouping)
                    {
                        throw new FilterException("表达式包含未关闭的括号。");
                    }

                    return node;
                }
                case FilterTokenType.PropertyName:
                {
                    var property = PropertyInfos.FirstOrDefault(x => x.Name.Equals(token.Value, StringComparison.OrdinalIgnoreCase));
                    if (property == null)
                    {
                        throw new FilterException($"表达式中包含了filter model中不存在的属性名称: {token.Value}。");
                    }

                    return new PropertyNode(property.Name, property.PropertyType, NodeType.Property);
                }
                case FilterTokenType.BinaryLogicalOperator:
                    return ParseExpression();
                case FilterTokenType.String:
                    return new ConstantNode(token.Value, typeof(string), NodeType.Constant);
                case FilterTokenType.Number:
                    return new ConstantNode(token.Value, typeof(decimal), NodeType.Constant);
                case FilterTokenType.True:
                case FilterTokenType.False:
                    return new ConstantNode(token.Value, typeof(bool), NodeType.Constant);
                case FilterTokenType.Null:
                    return new ConstantNode(token.Value, null, NodeType.Constant);
                case FilterTokenType.EndGrouping:
                    throw new FilterException("表达式包含不正确的分组。");
                case FilterTokenType.RelationalOperator:
                    throw new FilterException("表达式包含不正确的关系运算符。");
                default:
                    throw new FilterException($"非预期的token类型: {token.TokenType}。");
            }
        }

        private static void SetConstantValue(Type propertyType, string propertyName, string str, ConstantNode node)
        {
            if (str == "null")
            {
                node.Value = null;
                return;
            }

            var succeeded = true;
            if (propertyType == typeof(char) || propertyType == typeof(char?))
            {
                if (char.TryParse(str, out var value))
                {
                    node.Value = value;
                    return;
                }

                succeeded = false;
            }
            else if (propertyType == typeof(bool) || propertyType == typeof(bool?))
            {
                if (bool.TryParse(str, out var value))
                {
                    node.Value = value;
                    return;
                }

                succeeded = false;
            }
            else if (propertyType == typeof(byte) || propertyType == typeof(byte?))
            {
                if (byte.TryParse(str, out var value))
                {
                    node.Value = value;
                    return;
                }

                succeeded = false;
            }
            else if (propertyType == typeof(sbyte) || propertyType == typeof(sbyte?))
            {
                if (sbyte.TryParse(str, out var value))
                {
                    node.Value = value;
                    return;
                }

                succeeded = false;
            }
            else if (propertyType == typeof(short) || propertyType == typeof(short?))
            {
                if (short.TryParse(str, out var value))
                {
                    node.Value = value;
                    return;
                }

                succeeded = false;
            }
            else if (propertyType == typeof(ushort) || propertyType == typeof(ushort?))
            {
                if (ushort.TryParse(str, out var value))
                {
                    node.Value = value;
                    return;
                }

                succeeded = false;
            }
            else if (propertyType == typeof(int) || propertyType == typeof(int?))
            {
                if (int.TryParse(str, out var value))
                {
                    node.Value = value;
                    return;
                }

                succeeded = false;
            }
            else if (propertyType == typeof(uint) || propertyType == typeof(uint?))
            {
                if (uint.TryParse(str, out var value))
                {
                    node.Value = value;
                    return;
                }

                succeeded = false;
            }
            else if (propertyType == typeof(long) || propertyType == typeof(long?))
            {
                if (long.TryParse(str, out var value))
                {
                    node.Value = value;
                    return;
                }

                succeeded = false;
            }
            else if (propertyType == typeof(ulong) || propertyType == typeof(ulong?))
            {
                if (ulong.TryParse(str, out var value))
                {
                    node.Value = value;
                    return;
                }

                succeeded = false;
            }
            else if (propertyType == typeof(decimal) || propertyType == typeof(decimal?))
            {
                if (decimal.TryParse(str, out var value))
                {
                    node.Value = value;
                    return;
                }

                succeeded = false;
            }
            else if (propertyType == typeof(float) || propertyType == typeof(float?))
            {
                if (float.TryParse(str, out var value))
                {
                    node.Value = value;
                    return;
                }

                succeeded = false;
            }
            else if (propertyType == typeof(double) || propertyType == typeof(double?))
            {
                if (double.TryParse(str, out var value))
                {
                    node.Value = value;
                    return;
                }

                succeeded = false;
            }
            else if (propertyType == typeof(Guid) || propertyType == typeof(Guid?))
            {
                if (Guid.TryParse(str, out var value))
                {
                    node.Value = value;
                    return;
                }

                succeeded = false;
            }
            else if (propertyType == typeof(DateTime) || propertyType == typeof(DateTime?))
            {
                if (DateTime.TryParse(str, out var value))
                {
                    node.Value = value;
                    return;
                }

                succeeded = false;
            }

            if (!succeeded)
            {
                var nullableType = Nullable.GetUnderlyingType(propertyType);
                var typeName = nullableType != null ? $"Nullable<{nullableType}>" : propertyType.Name;
                throw new FilterException($"常量: {str} 不能转换到属性: {propertyName} 的类型: {typeName}。");
            }
        }
    }
}