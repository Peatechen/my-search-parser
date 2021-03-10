import { Lexer } from "chevrotain";

import { allTokens } from "./lexer/tokens";
import { filterParser } from "./parser/filter-parser";
import { filterVisitor } from "./visitor/filter-visiter";

const filterLexer = new Lexer(allTokens);

export function toAst(inputText: string): any {
  if (!inputText) {
    return null;
  }

  // Lex
  const lexResult = filterLexer.tokenize(inputText.trim());

  if (lexResult.errors.length) {
    throw new Error(
      `Lexer error! \n ${lexResult.errors
        .map((error) => error.message)
        .join("\n")}`
    );
  }

  filterParser.input = lexResult.tokens;

  // Automatic CST created when parsing
  const cst = filterParser.expressions();
  if (filterParser.errors.length > 0) {
    throw Error(
      `Sad sad panda, parsing errors detected!\n
        ${filterParser.errors.map((error) => error.message).join("\n")}`
    );
  }

  // Visit
  const ast = filterVisitor.visit(cst);
  return ast;
}
