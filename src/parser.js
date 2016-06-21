const AST = require('./ast');
const Token = require('./token');

class Parser {
  constructor(lexer) {
    this.lexer = lexer;
  }

  parse() {
    const result = this.parseTerm(Token.EOF);
    this.lexer.match(Token.EOF);
    return result;
  }

  parseTerm() {
    if (this.lexer.skip(Token.LAMBDA)) {
      const id = new AST.Identifier(this.lexer.token(Token.LCID).value);
      this.lexer.match(Token.DOT);
      const term = this.parseTerm();
      return new AST.Abstraction(id, term);
    }  else {
      return this.parseApplication();
    }
  }

  parseApplication() {
    let lhs = this.parseAtom();
    while (true) {
      const rhs = this.parseAtom();
      if (!rhs) {
        return lhs;
      } else {
        lhs = new AST.Application(lhs, rhs);
      }
    }
  }

  parseAtom() {
    if (this.lexer.skip(Token.LPAREN)) {
      const term = this.parseTerm(Token.RPAREN);
      this.lexer.match(Token.RPAREN);
      return term;
    } else if (this.lexer.next(Token.LCID)) {
      const id = new AST.Identifier(this.lexer.token(Token.LCID).value);
      return id;
    } else {
      return undefined;
    }
  }
}

module.exports = Parser;
