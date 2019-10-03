using System;
using System.Text;

namespace Viewer.Web.ApiFilter
{
    public ref struct FilterReader
    {
        private readonly ReadOnlySpan<byte> _buffer;
        private int _consumed;

        public FilterReader(ReadOnlySpan<byte> buffer)
        {
            _buffer = buffer;
            _consumed = 0;
            TokenType = FilterTokenType.None;

            ValueSpan = default;
            TokenStartIndex = 0;
        }

        public ReadOnlySpan<byte> ValueSpan { get; private set; }

        public int TokenStartIndex { get; private set; }

        public FilterTokenType TokenType { get; private set; }

        public static readonly UTF8Encoding Utf8Encoding = new UTF8Encoding(false, true);

        public bool Read()
        {
            var retVal = false;
            ValueSpan = default;

            if (!HasMoreData())
            {
                goto Done;
            }

            var first = _buffer[_consumed];
            if (first <= FilterConstants.Space)
            {
                SkipWhiteSpace();
                if (!HasMoreData())
                {
                    goto Done;
                }

                first = _buffer[_consumed];
            }

            TokenStartIndex = _consumed;

            if (TokenType == FilterTokenType.None)
            {
                goto ReadFirstToken;
            }

            return ConsumeNextToken();

            Done:
            return retVal;


            ReadFirstToken:
            retVal = ReadFirstToken(first);
            goto Done;
        }

        private bool HasMoreData()
        {
            return _consumed < _buffer.Length;
        }

        private void SkipWhiteSpace()
        {
            var localBuffer = _buffer;
            for (; _consumed < localBuffer.Length; _consumed++)
            {
                var val = localBuffer[_consumed];

                if (val != FilterConstants.Space &&
                    val != FilterConstants.CarriageReturn &&
                    val != FilterConstants.LineFeed &&
                    val != FilterConstants.Tab)
                {
                    break;
                }

                if (val == FilterConstants.LineFeed || val == FilterConstants.CarriageReturn)
                {
                    throw new FormatException("filter表达式不允许换行。");
                }
            }
        }

        private bool ReadFirstToken(byte first)
        {
            return ConsumeToken(first);
        }

        private bool TryGetReservedWord(ReadOnlySpan<byte> data, ReadOnlySpan<byte> reservedWord, out int consumed)
        {
            consumed = default;
            var span = data.Slice(0, reservedWord.Length);
            if (span.SequenceEqual(reservedWord))
            {
                if (reservedWord.Length < data.Length)
                {
                    var next = data[reservedWord.Length];
                    if (next != FilterConstants.Tab && next != FilterConstants.Space && next != FilterConstants.OpenParentheses)
                    {
                        return false;
                    }
                }

                ValueSpan = span;

                consumed = reservedWord.Length;
                return true;
            }

            return false;
        }

        private void ConsumeNumber(ReadOnlySpan<byte> data)
        {
            const string msg = "包含格式不正确的数字。";
            var i = 0;
            var val = data[i];
            var minusFlag = false;
            var decimalPointFlag = false;

            if (val == '-')
            {
                minusFlag = true;
            }

            while (val != FilterConstants.Tab && val != FilterConstants.Space && val != FilterConstants.CloseParentheses)
            {
                i++;
                if (i >= data.Length)
                {
                    break;
                }

                val = data[i];

                if (val == FilterConstants.Period)
                {
                    if (minusFlag && i == 1 || decimalPointFlag)
                    {
                        throw new FormatException(msg);
                    }

                    decimalPointFlag = true;
                    continue;
                }

                if (val == '-' || !char.IsDigit((char) val))
                {
                    throw new FormatException(msg);
                }
            }

            if (minusFlag && i == 1)
            {
                throw new FormatException(msg);
            }

            if (val == FilterConstants.Period)
            {
                throw new FormatException(msg);
            }

            ValueSpan = _buffer.Slice(_consumed, i);
            TokenType = FilterTokenType.Number;
            _consumed += i;
        }

        private void ConsumeString(ReadOnlySpan<byte> data)
        {
            var i = 0;

            while (true)
            {
                i++;
                if (i >= data.Length)
                {
                    break;
                }

                var val = data[i];

                if (val == FilterConstants.LineFeed || val == FilterConstants.CarriageReturn)
                {
                    throw new FormatException("filter表达式不允许换行。");
                }

                if (val == FilterConstants.Quote && data[i - 1] != FilterConstants.BackSlash)
                {
                    i++;
                    break;
                }
            }

            ValueSpan = _buffer.Slice(_consumed, i);
            TokenType = FilterTokenType.String;
            _consumed += i;
        }

        private void ConsumePropertyName(ReadOnlySpan<byte> data)
        {
            var i = 0;
            var val = data[i];

            while (val != FilterConstants.Tab && val != FilterConstants.Space)
            {
                i++;
                if (i >= data.Length)
                {
                    break;
                }

                val = data[i];

                if (val == FilterConstants.LineFeed || val == FilterConstants.CarriageReturn)
                {
                    throw new FormatException("filter表达式不允许换行。");
                }
            }

            ValueSpan = _buffer.Slice(_consumed, i);
            TokenType = FilterTokenType.PropertyName;
            _consumed += i;
        }

        private bool ConsumeNextToken()
        {
            var first = _buffer[_consumed];
            return ConsumeToken(first);
        }

        private bool ConsumeToken(byte first)
        {
            if (first == FilterConstants.OpenParentheses)
            {
                TokenType = FilterTokenType.StartGrouping;
                ValueSpan = _buffer.Slice(_consumed, 1);
                _consumed++;

                return true;
            }

            if (first == FilterConstants.CloseParentheses)
            {
                TokenType = FilterTokenType.EndGrouping;
                ValueSpan = _buffer.Slice(_consumed, 1);
                _consumed++;

                return true;
            }

            var localBuffer = _buffer.Slice(_consumed);
            int consumed;
            if (first == '-' || char.IsDigit((char) first))
            {
                ConsumeNumber(localBuffer);
                return true;
            }

            if (first == FilterConstants.Quote)
            {
                ConsumeString(localBuffer);
                return true;
            }

            if (first == 't')
            {
                if (TryGetReservedWord(localBuffer, FilterConstants.TrueValue, out consumed))
                {
                    TokenType = FilterTokenType.True;
                    _consumed += consumed;
                    return true;
                }
            }

            if (first == 'f')
            {
                if (TryGetReservedWord(localBuffer, FilterConstants.FalseValue, out consumed))
                {
                    TokenType = FilterTokenType.False;
                    _consumed += consumed;
                    return true;
                }
            }

            if (first == 'n')
            {
                if (TryGetReservedWord(localBuffer, FilterConstants.NullValue, out consumed))
                {
                    TokenType = FilterTokenType.Null;
                    _consumed += consumed;
                    return true;
                }

                if (TryGetReservedWord(localBuffer, FilterConstants.NotEqualOperatorValue, out consumed))
                {
                    TokenType = FilterTokenType.RelationalOperator;
                    _consumed += consumed;
                    return true;
                }

                if (TryGetReservedWord(localBuffer, FilterConstants.LogicalNegationOperatorValue, out consumed))
                {
                    TokenType = FilterTokenType.UnaryLogicalOperator;
                    _consumed += consumed;
                    return true;
                }
            }

            if (first == 'e')
            {
                if (TryGetReservedWord(localBuffer, FilterConstants.EqualOperatorValue, out consumed))
                {
                    TokenType = FilterTokenType.RelationalOperator;
                    _consumed += consumed;
                    return true;
                }
            }

            if (first == 'g')
            {
                if (TryGetReservedWord(localBuffer, FilterConstants.GreaterThanOperatorValue, out consumed))
                {
                    TokenType = FilterTokenType.RelationalOperator;
                    _consumed += consumed;
                    return true;
                }

                if (TryGetReservedWord(localBuffer, FilterConstants.GreaterThanOrEqualOperatorValue, out consumed))
                {
                    TokenType = FilterTokenType.RelationalOperator;
                    _consumed += consumed;
                    return true;
                }
            }

            if (first == 'l')
            {
                if (TryGetReservedWord(localBuffer, FilterConstants.LessThanOperatorValue, out consumed))
                {
                    TokenType = FilterTokenType.RelationalOperator;
                    _consumed += consumed;
                    return true;
                }

                if (TryGetReservedWord(localBuffer, FilterConstants.LessThanOrEqualOperatorValue, out consumed))
                {
                    TokenType = FilterTokenType.RelationalOperator;
                    _consumed += consumed;
                    return true;
                }
            }

            if (first == 'a')
            {
                if (TryGetReservedWord(localBuffer, FilterConstants.LogicalAndOperatorValue, out consumed))
                {
                    TokenType = FilterTokenType.BinaryLogicalOperator;
                    _consumed += consumed;
                    return true;
                }
            }

            if (first == 'o')
            {
                if (TryGetReservedWord(localBuffer, FilterConstants.LogicalOrOperatorValue, out consumed))
                {
                    TokenType = FilterTokenType.BinaryLogicalOperator;
                    _consumed += consumed;
                    return true;
                }
            }

            ConsumePropertyName(localBuffer);
            return true;
        }
    }
}