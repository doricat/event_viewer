using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Viewer.Web.ApiFilter
{
    public static class FilterReaderHelper
    {
        public static bool TryRead(ref FilterReader reader, string filterExpr, IList<PropertyInfo> propertyInfos, out IList<Token> tokens, out string error)
        {
            var position = 0;
            var retVal = true;
            tokens = new List<Token>();
            error = null;

            try
            {
                while (true)
                {
                    if (!reader.Read())
                    {
                        break;
                    }

                    var val = FilterReader.Utf8Encoding.GetString(reader.ValueSpan);
                    var i = filterExpr.IndexOf(val, position, StringComparison.Ordinal) + 1;
                    position += val.Length;
                    switch (reader.TokenType)
                    {
                        case FilterTokenType.PropertyName:
                        {
                            var propertyName = val.StartsWith((char) FilterConstants.At) ? val.Substring(1) : val;
                            if (!propertyInfos.Any(x => x.Name.Equals(propertyName, StringComparison.OrdinalIgnoreCase)))
                            {
                                throw new FilterException($"不存在的属性: {propertyName}。");
                            }

                            tokens.Add(new Token(FilterTokenType.PropertyName, propertyName, i));
                            break;
                        }
                        case FilterTokenType.StartGrouping:
                        case FilterTokenType.EndGrouping:
                        case FilterTokenType.UnaryLogicalOperator:
                        case FilterTokenType.BinaryLogicalOperator:
                        case FilterTokenType.RelationalOperator:
                        case FilterTokenType.Number:
                        case FilterTokenType.True:
                        case FilterTokenType.False:
                        case FilterTokenType.Null:
                            tokens.Add(new Token(reader.TokenType, val, i));
                            break;
                        case FilterTokenType.String:
                        {
                            var s = val.Substring(1, val.Length - 2);
                            tokens.Add(new Token(reader.TokenType, s, i));
                            break;
                        }
                        default:
                            throw new ArgumentOutOfRangeException();
                    }
                }
            }
            catch (FormatException e)
            {
                retVal = false;
                error = e.Message;
            }

            return retVal;
        }
    }
}