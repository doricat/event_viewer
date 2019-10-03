using System;

namespace Viewer.Web.ApiFilter
{
    public class PropertyNode : Node
    {
        public PropertyNode(string name, Type propertyType, NodeType type) : base(type)
        {
            Name = name;
            PropertyType = propertyType;
        }

        public string Name { get; set; }

        public Type PropertyType { get; set; }

        internal object BoundValue { get; set; }

        public override string ToString()
        {
            return $"NodeType: {Type}, Name: {Name}, PropertyType: {PropertyType}";
        }
    }
}