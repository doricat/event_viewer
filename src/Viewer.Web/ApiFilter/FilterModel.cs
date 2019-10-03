using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using Microsoft.AspNetCore.Mvc;

namespace Viewer.Web.ApiFilter
{
    [ModelBinder(typeof(FilterModelBinder))]
    public class FilterModel<T> : IValidatableObject
        where T : class
    {
        public FilterModel(string filterExpr)
        {
            FilterExpr = filterExpr ?? throw new ArgumentNullException(nameof(filterExpr));
            var type = typeof(T);
            TargetModelPropertyInfos = type.GetProperties(BindingFlags.Public | BindingFlags.Instance);
        }

        public string FilterExpr { get; }

        public IList<PropertyInfo> TargetModelPropertyInfos { get; }

        public IList<Token> Tokens { get; private set; }

        public Node Node { get; private set; }

        public Expression<Func<TEntity, bool>> ToLambda<TEntity>() where TEntity : class
        {
            var parameter = Expression.Parameter(typeof(TEntity), "x");
            return Expression.Lambda<Func<TEntity, bool>>(Node.ToExpression(parameter), parameter);
        }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var result = new List<ValidationResult>();
            var reader = new FilterReader(FilterReader.Utf8Encoding.GetBytes(FilterExpr));
            if (FilterReaderHelper.TryRead(ref reader, FilterExpr, TargetModelPropertyInfos, out var tokens, out var error))
            {
                Tokens = tokens;

                var parser = new FilterParser(tokens, TargetModelPropertyInfos);
                try
                {
                    var node = parser.Parse();
                    Node = node;
                }
                catch (FilterException e)
                {
                    result.Add(new ValidationResult(e.Message, new[] {"$filter"}));
                }
            }
            else
            {
                result.Add(new ValidationResult(error, new[] {"$filter"}));
            }

            return result;
        }

        protected ValidationResult Validate(PropertyNode node)
        {
            /*
             * string: length, regex
             * number & datetime: range
             * bool
             * null
             */

            var propertyInfo = TargetModelPropertyInfos.FirstOrDefault(x => x.Name == node.Name);
            if (propertyInfo == null)
            {
                return null;
            }

            ValidationResult result = null;

            var displayAttr = propertyInfo.GetCustomAttribute<DisplayAttribute>();
            var memberName = displayAttr != null ? displayAttr.Name : propertyInfo.Name;

            var attrs = propertyInfo.GetCustomAttributes<ValidationAttribute>();
            foreach (var attribute in attrs)
            {
                if (propertyInfo.PropertyType == typeof(string))
                {
                    var value = node.BoundValue;
                    if (attribute is StringLengthAttribute stringLength && !stringLength.IsValid(value))
                    {
                        var msg = stringLength.FormatErrorMessage(memberName);
                        result = new ValidationResult(msg, new[] {propertyInfo.Name});
                    }
                    else if (attribute is RegularExpressionAttribute regularExpression && !regularExpression.IsValid(value))
                    {
                        var msg = regularExpression.FormatErrorMessage(memberName);
                        result = new ValidationResult(msg, new[] {propertyInfo.Name});
                    }
                }
                else if (IsNumber(propertyInfo.PropertyType))
                {
                    var value = node.BoundValue;
                    if (attribute is RangeAttribute range && !range.IsValid(value))
                    {
                        var msg = range.FormatErrorMessage(memberName);
                        result = new ValidationResult(msg, new[] {propertyInfo.Name});
                    }
                }
            }

            return result;
        }

        private static bool IsNumber(Type type)
        {
            var nullableType = Nullable.GetUnderlyingType(type);
            var localType = nullableType ?? type;
            return localType == typeof(byte) ||
                   localType == typeof(sbyte) ||
                   localType == typeof(short) ||
                   localType == typeof(ushort) ||
                   localType == typeof(int) ||
                   localType == typeof(uint) ||
                   localType == typeof(long) ||
                   localType == typeof(ulong) ||
                   localType == typeof(decimal) ||
                   localType == typeof(float) ||
                   localType == typeof(double) ||
                   localType == typeof(DateTime);
        }
    }
}