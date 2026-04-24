import { describe, expect, test } from "bun:test";
import {
  buildHelpMessage,
  classifyDiceTotal,
  getMentionCommand,
  parseRollCommand,
} from "./bot";

describe("getMentionCommand", () => {
  test("returns the text after the TeamGaga bot mention", () => {
    expect(getMentionCommand("@{!bot_123} roll big", "bot_123")).toBe(
      "roll big",
    );
  });

  test("ignores messages that do not start with the TeamGaga bot mention", () => {
    expect(getMentionCommand("hello @{!bot_123} roll big", "bot_123")).toBe(
      null,
    );
  });
});

describe("parseRollCommand", () => {
  test("accepts roll big and roll small", () => {
    expect(parseRollCommand("roll big")).toBe("big");
    expect(parseRollCommand("roll small")).toBe("small");
  });

  test("rejects unknown commands", () => {
    expect(parseRollCommand("roll middle")).toBe(null);
    expect(parseRollCommand("help")).toBe(null);
  });
});

describe("classifyDiceTotal", () => {
  test("classifies totals from 3 to 10 as small and 11 to 18 as big", () => {
    expect(classifyDiceTotal(10)).toBe("small");
    expect(classifyDiceTotal(11)).toBe("big");
  });
});

test("buildHelpMessage explains the two commands", () => {
  expect(buildHelpMessage()).toContain("roll big");
  expect(buildHelpMessage()).toContain("roll small");
});
