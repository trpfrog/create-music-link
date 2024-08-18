import { describe, test, expect } from "vitest";
import { joinWithAnd, fillTemplate } from "./utils";

describe("joinWithAnd", () => {
  test.each([
    [["Alpha", "Bravo", "Charlie", "Delta"], "Alpha, Bravo, Charlie and Delta"],
    [["Alpha", "Bravo", "Charlie"], "Alpha, Bravo and Charlie"],
    [["Alpha", "Bravo"], "Alpha and Bravo"],
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
