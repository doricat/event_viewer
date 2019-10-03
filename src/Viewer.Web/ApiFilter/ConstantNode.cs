using System;

namespace Viewer.Web.ApiFilter
{
    public class ConstantNode : Node
    {
        public ConstantNode(object value, Type valueType, NodeType type) : base(type)
        {
            Value = value;
            ValueType = valueType;
        }

        public object Value { get; set; }

        public Type ValueType { get; set; }

        public override string ToString()
        {
            return $"NodeType: {Type}, Value: {Value}, ValueType: {ValueType}";
        }
    }
}