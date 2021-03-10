import { filterParser } from "../parser/filter-parser";

const BaseCstVisitor = filterParser.getBaseCstVisitorConstructor();

class FilterVisitor extends BaseCstVisitor {
  constructor() {
    super();
    // This helper will detect any missing or redundant methods on this visitor
    this.validateVisitor();
  }

  expression(ctx) {
    let result;
    if (ctx.compareRule) {
      result = this.visit(ctx.compareRule);
    } else {
      result = this.visit(ctx.parentAndOrExp);
    }

    if (ctx.Not) {
      return {
        type: "NOT",
        node: result,
      };
    }
    return result;
  }

  atomicExp(ctx) {
    if ("Integer" in ctx) {
      return Number(ctx.Integer[0].image);
    }

    if ("Float" in ctx) {
      return Number(ctx.Float[0].image);
    }

    if ("Null" in ctx) {
      return null;
    }

    if ("True" in ctx) {
      return true;
    }

    if ("False" in ctx) {
      return false;
    }

    return ctx.String[0].image.slice(1, ctx.String[0].image.length - 1);
  }

  dateExp(ctx) {
    return new Date(
      ctx.String[0].image.slice(1, ctx.String[0].image.length - 1)
    );
  }

  compareRule(ctx) {
    let cmpOp = "";

    if (ctx.EqOp) cmpOp = "EQ";
    if (ctx.NotEqOp) cmpOp = "NE";
    if (ctx.GtOp) cmpOp = "GT";
    if (ctx.GteOp) cmpOp = "GET";
    if (ctx.LtOp) cmpOp = "LT";
    if (ctx.LteOp) cmpOp = "LTE";

    return {
      type: cmpOp,
      filed: ctx.Identifier[0].image,
      value: this.visit(ctx.atomicExp),
    };
  }

  expressions(ctx) {
    const query = ctx.andOrExp ? this.visit(ctx.andOrExp) : {};
    return {
      filter: query,
    };
  }

  andOrExp(ctx) {
    // 找到左边第一个表达式
    const leftHandSide = this.visit(ctx.lhs);

    // 找到所有 And、Or
    const opTokens = [];
    ctx.OrOp && opTokens.push(...ctx.OrOp);
    ctx.AndOp && opTokens.push(...ctx.AndOp);

    // opTokens = opTokens.sort((a, b) => a.startOffset - b.startOffset);

    // 找到所有右边的表达式
    const rightHandSide = [];

    if (ctx.rhs) {
      ctx.rhs.forEach((_) => {
        rightHandSide.push(this.visit(_));
      });
    }

    // 将左边的表达式从头部插入到数组
    rightHandSide.unshift(leftHandSide);

    // 如果只有一个表达式则，则直接返回这个表达式
    if (rightHandSide.length === 1) return rightHandSide.pop();

    // 获取最左边的第一个表达式，
    let prev = rightHandSide.pop();

    opTokens.forEach((_) => {
      prev = {
        type: _.image,
        nodes: [rightHandSide.pop(), prev],
      };
    });

    return prev;
  }

  array(ctx, convertToId = false) {
    const res = ctx.atomicExp.map((_) => this.visit(_));
    return convertToId ? res.map((_) => _) : res;
  }

  inExp(ctx) {
    return {
      [ctx.Identifier[0].image]: {
        $in: this.visit(ctx.array, ctx.Identifier[0].image === "id"),
      },
    };
  }

  notInExp(ctx) {
    return {
      [ctx.Identifier[0].image]: {
        $nin: this.visit(ctx.array),
      },
    };
  }

  parentAndOrExp(ctx) {
    return {
      type: "SUB",
      node: this.visit(ctx.andOrExp),
    };
  }

  // orderBy(ctx, shouldAggregate = false) {
  //   const ids = ctx.Identifier.sort((a, b) => a.startOffset - b.startOffset);
  //   const dirs = [...(ctx?.Asc ?? []), ...(ctx?.Desc ?? [])].sort(
  //     (a, b) => a.startOffset - b.startOffset
  //   );

  //   const items = {} as any;
  //   ids.forEach((_, i) => {
  //     items[_.image] = dirs[i].image === "asc" ? 1 : -1;
  //   });

  //   return { [shouldAggregate ? "$sort" : "$orderby"]: items };
  // }

  // take(ctx) {
  //   return { $limit: Number(ctx.Integer[0].image) };
  // }

  // skip(ctx) {
  //   return { $skip: Number(ctx.Integer[0].image) };
  // }
}

export const filterVisitor = new FilterVisitor();
