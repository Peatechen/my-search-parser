import { strict as assert } from "assert";
import { CstNode, CstParser } from "chevrotain";

import {
  allTokens,
  AndOp,
  EqOp,
  False,
  Float,
  GteOp,
  GtOp,
  Identifier,
  Integer,
  LParen,
  LteOp,
  LtOp,
  Not,
  NotEqOp,
  Null,
  OrOp,
  RParen,
  String,
  True,
} from "../lexer/tokens";

type Rule = (idx?: number) => CstNode;

function UndefinedRule(): CstNode {
  assert(false);
}

class FilterParser extends CstParser {
  expressions: Rule = UndefinedRule;
  expression: Rule = UndefinedRule;
  andOrExp: Rule = UndefinedRule;
  compareRule: Rule = UndefinedRule;
  parentAndOrExp: Rule = UndefinedRule;
  atomicExp: Rule = UndefinedRule;

  constructor() {
    super(allTokens);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const $ = this;

    $.RULE("expressions", () => {
      $.SUBRULE($.andOrExp);
    });

    $.RULE("expression", () => {
      $.OPTION(() => {
        this.CONSUME(Not);
      });
      $.OR([
        {
          ALT: () => {
            $.SUBRULE($.compareRule);
          },
        },
        {
          ALT: () => {
            $.SUBRULE($.parentAndOrExp);
          },
        },
      ]);
    });

    // $.RULE("array", () => {
    //   $.CONSUME(LBraket);
    //   $.AT_LEAST_ONE_SEP({
    //     SEP: Comma,
    //     DEF: () => {
    //       $.SUBRULE($.atomicExp);
    //     },
    //   });
    //   $.CONSUME(RBraket);
    // });

    $.RULE("andOrExp", () => {
      $.SUBRULE($.expression, { LABEL: "lhs" });
      $.MANY(() => {
        $.OR([
          {
            ALT: () => {
              $.CONSUME(AndOp);
            },
          },
          {
            ALT: () => {
              $.CONSUME(OrOp);
            },
          },
        ]);
        $.SUBRULE2($.expression, { LABEL: "rhs" });
      });
    });

    $.RULE("parentAndOrExp", () => {
      $.CONSUME(LParen);
      $.SUBRULE($.andOrExp);
      $.CONSUME(RParen);
    });

    $.RULE("compareRule", () => {
      $.CONSUME(Identifier);
      $.OR([
        {
          ALT: () => {
            $.CONSUME(EqOp);
          },
        },
        {
          ALT: () => {
            $.CONSUME(NotEqOp);
          },
        },
        {
          ALT: () => {
            $.CONSUME(GtOp);
          },
        },
        {
          ALT: () => {
            $.CONSUME(GteOp);
          },
        },
        {
          ALT: () => {
            $.CONSUME(LtOp);
          },
        },
        {
          ALT: () => {
            $.CONSUME(LteOp);
          },
        },
      ]);
      $.SUBRULE($.atomicExp);
    });

    $.RULE("atomicExp", () => {
      $.OR([
        {
          ALT: () => {
            $.CONSUME(Integer);
          },
        },
        {
          ALT: () => {
            $.CONSUME(Float);
          },
        },
        {
          ALT: () => {
            $.CONSUME(String);
          },
        },
        {
          ALT: () => {
            $.CONSUME(Null);
          },
        },
        {
          ALT: () => {
            $.CONSUME(True);
          },
        },
        {
          ALT: () => {
            $.CONSUME(False);
          },
        },
      ]);
    });

    // very important to call this after all the rules have been defined.
    // otherwise the parser may not work correctly as it will lack information
    // derived during the self analysis phase.
    this.performSelfAnalysis();
  }
}

export const filterParser = new FilterParser();
