using System;

namespace Viewer.Web.ApiFilter
{
    public static class FilterConstants
    {
        public const byte OpenParentheses = (byte) '(';
        public const byte CloseParentheses = (byte) ')';
        public const byte Space = (byte) ' ';
        public const byte CarriageReturn = (byte) '\r';
        public const byte LineFeed = (byte) '\n';
        public const byte Tab = (byte) '\t';
        public const byte Quote = (byte) '\'';
        public const byte BackSlash = (byte) '\\';
        public const byte Slash = (byte) '/';
        public const byte BackSpace = (byte) '\b';
        public const byte FormFeed = (byte) '\f';
        public const byte Period = (byte) '.';
        public const byte At = (byte) '@';

        public static ReadOnlySpan<byte> TrueValue => new[] {(byte) 't', (byte) 'r', (byte) 'u', (byte) 'e'};
        public static ReadOnlySpan<byte> FalseValue => new[] {(byte) 'f', (byte) 'a', (byte) 'l', (byte) 's', (byte) 'e'};
        public static ReadOnlySpan<byte> NullValue => new[] {(byte) 'n', (byte) 'u', (byte) 'l', (byte) 'l'};
        public static ReadOnlySpan<byte> EqualOperatorValue => new[] {(byte) 'e', (byte) 'q'};
        public static ReadOnlySpan<byte> NotEqualOperatorValue => new[] {(byte) 'n', (byte) 'e'};
        public static ReadOnlySpan<byte> GreaterThanOperatorValue => new[] {(byte) 'g', (byte) 't'};
        public static ReadOnlySpan<byte> GreaterThanOrEqualOperatorValue => new[] {(byte) 'g', (byte) 'e'};
        public static ReadOnlySpan<byte> LessThanOperatorValue => new[] {(byte) 'l', (byte) 't'};
        public static ReadOnlySpan<byte> LessThanOrEqualOperatorValue => new[] {(byte) 'l', (byte) 'e'};
        public static ReadOnlySpan<byte> LogicalAndOperatorValue => new[] {(byte) 'a', (byte) 'n', (byte) 'd'};
        public static ReadOnlySpan<byte> LogicalOrOperatorValue => new[] {(byte) 'o', (byte) 'r'};
        public static ReadOnlySpan<byte> LogicalNegationOperatorValue => new[] {(byte) 'n', (byte) 'o', (byte) 't'};
    }
}