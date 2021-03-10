import { createToken, Lexer } from "chevrotain";

// 定义令牌
export const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z_][\w\d_]*/,
});
export const LParen = createToken({ name: "LParen", pattern: /\(/ });
export const RParen = createToken({ name: "RParen", pattern: /\)/ });
export const Float = createToken({ name: "Float", pattern: /\d+\.\d+/ });
export const Null = createToken({
  name: "Null",
  pattern: /NULL/,
  longer_alt: Identifier,
});
export const Not = createToken({
  name: "Not",
  pattern: /NOT/,
  longer_alt: Identifier,
});
export const Integer = createToken({
  name: "Integer",
  pattern: /\d+/,
  longer_alt: Float,
});
export const String = createToken({ name: "String", pattern: /'.*?'/ });
export const True = createToken({
  name: "True",
  pattern: /true/,
  longer_alt: Identifier,
});
export const False = createToken({
  name: "False",
  pattern: /false/,
  longer_alt: Identifier,
});
export const Comma = createToken({ name: "Comma", pattern: /,/ });
export const LCurly = createToken({ name: "LCurly", pattern: /\{/ });
export const RCurly = createToken({ name: "RCurly", pattern: /\}/ });
export const LBraket = createToken({ name: "LBraket", pattern: /\[/ });
export const RBraket = createToken({ name: "RBraket", pattern: /\]/ });

export const EqOp = createToken({
  name: "EqOp",
  pattern: /:/,
  longer_alt: Identifier,
});

export const NotEqOp = createToken({
  name: "NotEqOp",
  pattern: /!:/,
  longer_alt: Identifier,
});

export const LtOp = createToken({
  name: "LtOp",
  pattern: /:</,
  longer_alt: Identifier,
});

export const LteOp = createToken({
  name: "LteOp",
  pattern: /:<=/,
  longer_alt: Identifier,
});
export const GtOp = createToken({
  name: "GtOp",
  pattern: /:>/,
  longer_alt: Identifier,
});
export const GteOp = createToken({
  name: "GteOp",
  pattern: /:>=/,
  longer_alt: Identifier,
});

export const AndOp = createToken({
  name: "AndOp",
  pattern: /AND/,
  longer_alt: Identifier,
});
export const OrOp = createToken({
  name: "OrOp",
  pattern: /OR/,
  longer_alt: Identifier,
});

export const InOp = createToken({
  name: "InOp",
  pattern: /in/,
  longer_alt: Identifier,
});
export const NotInOp = createToken({
  name: "NotInOp",
  pattern: /!in/,
  longer_alt: Identifier,
});

export const OrderBy = createToken({
  name: "OrderBy",
  pattern: /order\s+by/,
  longer_alt: Identifier,
});
export const Asc = createToken({
  name: "Asc",
  pattern: /asc/,
  longer_alt: Identifier,
});
export const Desc = createToken({
  name: "Desc",
  pattern: /desc/,
  longer_alt: Identifier,
});
export const Take = createToken({
  name: "Take",
  pattern: /take/,
  longer_alt: Identifier,
});
export const Skip = createToken({
  name: "Skip",
  pattern: /skip/,
  longer_alt: Identifier,
});

// marking WhiteSpace as 'SKIPPED' makes the lexer skip it.
export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

export const allTokens = [
  OrderBy,
  WhiteSpace,
  True,
  False,
  Asc,
  Desc,
  Take,
  Skip,
  NotInOp,
  InOp,
  AndOp,
  Not,
  OrOp,
  GteOp,
  GtOp,
  LteOp,
  LtOp,
  NotEqOp,
  EqOp,
  LParen,
  RParen,
  LBraket,
  RBraket,
  Comma,
  Float,
  Integer,
  Null,
  Identifier,
  LCurly,
  RCurly,
  String,
];
