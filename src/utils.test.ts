import { describe, test, expect } from "vitest";
import { joinWithAnd } from "./utils";

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
