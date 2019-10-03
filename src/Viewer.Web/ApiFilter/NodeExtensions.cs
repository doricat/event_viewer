using System;
using System.Linq.Expressions;

namespace Viewer.Web.ApiFilter
{
    public static class NodeExtensions
    {
        public static Expression ToExpression(this Node root, ParameterExpression parameter)
        {
            switch (root.Type)
            {
                case NodeType.UnaryLogicalExpression:
                {
                    var expressionNode = (UnaryExpressionNode) root;
                    switch (expressionNode.Operator)
                    {
                        case "not":
                            return Expression.Not(ToExpression(expressionNode.Params[0], parameter));

                        default:
                            throw new ArgumentOutOfRangeException(nameof(expressionNode.Operator));
                    }
                }
                case NodeType.BinaryLogicalExpression:
                {
                    var expressionNode = (BinaryExpressionNode) root;
                    var left = ToExpression(expressionNode.Params[0], parameter);
                    var right = ToExpression(expressionNode.Params[1], parameter);
                    switch (expressionNode.Operator)
                    {
                        case "and":
                            return Expression.AndAlso(left, right);

                        case "or":
                            return Expression.OrElse(left, right);

                        default:
                            throw new ArgumentOutOfRangeException(nameof(expressionNode.Operator));
                    }
                }
                case NodeType.RelationalExpression:
                {
                    var expressionNode = (BinaryExpressionNode) root;
                    var left = ToExpression(expressionNode.Params[0], parameter);
                    var right = ToExpression(expressionNode.Params[1], parameter);
                    switch (expressionNode.Operator)
                    {
                        case "eq":
                            return Expression.Equal(left, right);

                        case "ne":
                            return Expression.NotEqual(left, right);

                        case "gt":
                            return Expression.GreaterThan(left, right);

                        case "ge":
                            return Expression.GreaterThanOrEqual(left, right);

                        case "lt":
                            return Expression.LessThan(left, right);

                        case "le":
                            return Expression.LessThanOrEqual(left, right);

                        default:
                            throw new ArgumentOutOfRangeException(nameof(expressionNode.Operator));
                    }
                }
                case NodeType.Property:
                {
                    var propertyNode = (PropertyNode) root;
                    return Expression.Property(parameter, propertyNode.Name);
                }
                case NodeType.Constant:
                {
                    var constantNode = (ConstantNode) root;
                    return Expression.Constant(constantNode.Value);
                }
                default:
                    throw new ArgumentOutOfRangeException(nameof(root));
            }
        }
    }
}