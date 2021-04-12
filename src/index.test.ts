import { toAst } from "./index";

test("Empty query", () => {
  expect(toAst("")).toBe(null);
  expect(toAst(null)).toBe(null);
  expect(toAst(undefined)).toBe(null);
});

test("Is not null", () => {
  expect(toAst("NOT field:NULL")).toMatchObject({
    filter: {
      type: "NOT",
      node: {
        type: "EQ",
        filed: "field",
        value: null,
      },
    },
  });
});

test("Removes leading and trailing whitespace", () => {
  expect(toAst("field:1 ")).toMatchObject({
    filter: {
      type: "EQ",
      filed: "field",
      value: 1,
    },
  });
});

test("Decimal point", () => {
  expect(toAst("number:123.45")).toMatchObject({
    filter: {
      type: "EQ",
      filed: "number",
      value: 123.45,
    },
  });
});

test("GT", () => {
  expect(toAst("number:>123.45")).toMatchObject({
    filter: {
      type: "GT",
      filed: "number",
      value: 123.45,
    },
  });
});

test("AND", () => {
  expect(toAst("name:1 AND enable:true")).toMatchObject({
    filter: {
      type: "AND",
      nodes: [
        {
          type: "EQ",
          filed: "name",
          value: 1,
        },
        {
          type: "EQ",
          filed: "enable",
          value: true,
        },
      ],
    },
  });
});

test("OR", () => {
  expect(toAst("name:John OR enable:true")).toMatchObject({
    filter: {
      type: "OR",
      nodes: [
        {
          type: "EQ",
          filed: "name",
          value: "John",
        },
        {
          type: "EQ",
          filed: "enable",
          value: true,
        },
      ],
    },
  });
});

test("Subquery", () => {
  expect(
    toAst(
      'name:John OR (created_at:>="2020-01-01 00:00:00" AND created_at:<="2020-12-31 23:59:59")'
    )
  ).toMatchObject({
    filter: {
      type: "OR",
      nodes: [
        {
          type: "EQ",
          filed: "name",
          value: "John",
        },
        {
          type: "SUB",
          node: {
            type: "AND",
            nodes: [
              {
                type: "GET",
                filed: "created_at",
                value: "2020-01-01 00:00:00",
              },
              {
                type: "LTE",
                filed: "created_at",
                value: "2020-12-31 23:59:59",
              },
            ],
          },
        },
      ],
    },
  });
});

test("Priority", () => {
  expect(toAst("a:0 OR b:0 AND c:0 AND d:0")).toMatchObject({
    filter: {
      type: "AND",
      nodes: [
        {
          type: "EQ",
          filed: "a",
          value: 0,
        },
        {
          type: "AND",
          nodes: [
            {
              type: "EQ",
              filed: "b",
              value: 0,
            },
            {
              type: "OR",
              nodes: [
                {
                  type: "EQ",
                  filed: "c",
                  value: 0,
                },
                {
                  type: "EQ",
                  filed: "d",
                  value: 0,
                },
              ],
            },
          ],
        },
      ],
    },
  });
});

// 测试查询短句
test("Phrase", () => {
  expect(toAst('name:"John" OR enable:true')).toMatchObject({
    filter: {
      type: "OR",
      nodes: [
        {
          type: "EQ",
          filed: "name",
          value: "John",
          phrase: true,
        },
        {
          type: "EQ",
          filed: "enable",
          value: true,
        },
      ],
    },
  });
});
