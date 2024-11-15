import { describe, test, expect, vi } from "vitest";
import {
  joinWithAnd,
  fillTemplate,
  extractAllCaptureGroups,
  withCallLimit,
} from "./utils";

describe("joinWithAnd", () => {
  test.each([
    [["Alpha", "Bravo", "Charlie", "Delta"], "Alpha, Bravo, Charlie & Delta"],
    [["Alpha", "Bravo", "Charlie"], "Alpha, Bravo & Charlie"],
    [["Alpha", "Bravo"], "Alpha & Bravo"],
    [["Alpha"], "Alpha"],
    [[], ""],
  ])("should join as %s => '%s'", (input, expected) => {
    expect(joinWithAnd(input)).toBe(expected);
  });
});

describe("fillTemplate", () => {
  const testCases: {
    name: string;
    template: string;
    values: Record<string, string | number>;
    expected: string;
  }[] = [
    {
      name: "Single variable",
      template: "Hello, ${name}!",
      values: { name: "World" },
      expected: "Hello, World!",
    },
    {
      name: "Multiple variables",
      template: "${greeting}, ${name}! Welcome to ${place}.",
      values: { greeting: "Hi", name: "Alice", place: "Wonderland" },
      expected: "Hi, Alice! Welcome to Wonderland.",
    },
    {
      name: "Insert numbers",
      template: "Today is ${month} ${date}. The price of apple is $${price}.",
      values: { month: "August", date: 18, price: 1.99 },
      expected: "Today is August 18. The price of apple is $1.99.",
    },
    {
      name: "Missing variables",
      template: "Hello, ${name}! Your age is ${age}.",
      values: { name: "Bob" },
      expected: "Hello, Bob! Your age is ${age}.",
    },
    {
      name: "Using same variable multiple times",
      template: "${name} loves ${name}'s ${pet}.",
      values: { name: "Charlie", pet: "dog" },
      expected: "Charlie loves Charlie's dog.",
    },
    {
      name: "Empty string",
      template: "Hello, ${name}! Welcome to ${place}.",
      values: { name: "", place: "the party" },
      expected: "Hello, ! Welcome to the party.",
    },
    {
      name: "${...} as a value",
      template: "${value1} and ${value2}",
      values: { value1: "${value2}", value2: "${value1}" },
      expected: "${value2} and ${value1}",
    },
  ];
  test.each(testCases)("$name", ({ template, values, expected }) => {
    expect(fillTemplate(template, values)).toBe(expected);
  });
});

describe("extractAllCaptureGroups", () => {
  test.each([
    { re: /(\d+)/g, str: "123 456 789", expected: [["123"], ["456"], ["789"]] },
    {
      re: /(\w+)/g,
      str: "Alpha Bravo Charlie",
      expected: [["Alpha"], ["Bravo"], ["Charlie"]],
    },
    {
      re: /(\d+)(\w+)/g,
      str: "123Alpha 456Bravo 789Charlie",
      expected: [
        ["123", "Alpha"],
        ["456", "Bravo"],
        ["789", "Charlie"],
      ],
    },
  ])("should extract all capture groups #%#", ({ re, str, expected }) => {
    expect(extractAllCaptureGroups(re, str)).toEqual(expected);
  });
});

describe("withCallLimit", () => {
  test("should throw an error when called more than the limit", () => {
    const fn = vi.fn();
    const safeFn = withCallLimit(fn, 3);

    expect(() => safeFn()).not.toThrow();
    expect(() => safeFn()).not.toThrow();
    expect(() => safeFn()).not.toThrow();
    expect(() => safeFn()).toThrow();
  });

  test("should pass arguments to the original function", () => {
    const fn = vi.fn();
    const safeFn = withCallLimit(fn, 3);

    safeFn(1, 2, 3);
    expect(fn).toHaveBeenCalledWith(1, 2, 3);
  });
});
