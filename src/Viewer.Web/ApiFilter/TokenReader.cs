using System;
using System.Collections.Generic;

namespace Viewer.Web.ApiFilter
{
    public class TokenReader
    {
        private readonly IList<Token> _tokens;
        private int _consumed;

        public TokenReader(IList<Token> tokens)
        {
            _tokens = tokens ?? throw new ArgumentNullException(nameof(tokens));
            _consumed = 0;
        }

        public Token Read()
        {
            var token = _tokens[_consumed];
            _consumed++;
            return token;
        }

        public Token Peek()
        {
            if (_consumed >= _tokens.Count)
            {
                return new Token(FilterTokenType.ExprEnd, null, null);
            }

            return _tokens[_consumed];
        }
    }
}