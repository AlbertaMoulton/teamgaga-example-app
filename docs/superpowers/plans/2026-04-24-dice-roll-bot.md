# Dice Roll Bot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a beginner-friendly TeamGaga bot demo where users mention the bot and run `roll big` or `roll small`.

**Architecture:** Keep TeamGaga HTTP calls in `src/teamgaga.ts`. Put the runnable demo and small pure helper functions in `src/bot.ts`, then export helpers so Bun tests can cover parsing and game behavior without calling the network.

**Tech Stack:** Bun, TypeScript, built-in `fetch`, `bun:test`.

---

### Task 1: Add tests for dice bot helpers

**Files:**
- Create: `src/bot.test.ts`
- Modify: `src/bot.ts`

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, expect, test } from "bun:test";
import {
  buildHelpMessage,
  classifyDiceTotal,
  getMentionCommand,
  parseRollCommand,
} from "./bot";

describe("getMentionCommand", () => {
  test("returns the text after the TeamGaga bot mention", () => {
    expect(getMentionCommand("@{!bot_123} roll big", "bot_123")).toBe("roll big");
  });

  test("ignores messages that do not start with the TeamGaga bot mention", () => {
    expect(getMentionCommand("hello @{!bot_123} roll big", "bot_123")).toBe(null);
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun test src/bot.test.ts`

Expected: FAIL because `src/bot.ts` does not export the helper functions yet.

### Task 2: Implement the runnable bot

**Files:**
- Modify: `src/bot.ts`
- Modify: `src/teamgaga.ts`

- [ ] **Step 1: Add helper functions and the polling loop**

```ts
import { TeamGagaClient } from "./teamgaga";
import type { MessageStruct } from "./type";

type Guess = "big" | "small";

const DEFAULT_POLL_INTERVAL_MS = 3000;

export function getMentionCommand(content: string, botId: string): string | null {
  const mention = `@{!${botId}}`;
  if (!content.startsWith(mention)) return null;
  return content.slice(mention.length).trim();
}

export function parseRollCommand(command: string): Guess | null {
  const parts = command.toLowerCase().trim().split(/\s+/);
  if (parts[0] !== "roll") return null;
  if (parts[1] === "big" || parts[1] === "small") return parts[1];
  return null;
}

export function rollDice(): number[] {
  return Array.from({ length: 3 }, () => Math.floor(Math.random() * 6) + 1);
}

export function classifyDiceTotal(total: number): Guess {
  return total >= 11 ? "big" : "small";
}

export function buildHelpMessage(): string {
  return "Try: roll big or roll small";
}

export function buildGameMessage(guess: Guess, dice: number[]): string {
  const total = dice.reduce((sum, value) => sum + value, 0);
  const result = classifyDiceTotal(total);
  const outcome = guess === result ? "You win!" : "You lose.";
  return `Dice: ${dice.join(" + ")} = ${total}, result: ${result}. You guessed ${guess}. ${outcome}`;
}

async function reply(client: TeamGagaClient, message: MessageStruct, content: string) {
  await client.sendMessage({
    channelId: message.channel_id,
    content,
    quote_id: message.message_id,
  });
}

async function handleMessage(client: TeamGagaClient, message: MessageStruct, botId: string) {
  const command = getMentionCommand(message.content, botId);
  if (command === null) return;

  const guess = parseRollCommand(command);
  const content = guess === null ? buildHelpMessage() : buildGameMessage(guess, rollDice());
  await reply(client, message, content);
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} in .env`);
  return value;
}

function getPollIntervalMs(): number {
  const value = Number(process.env.POLL_INTERVAL_MS || DEFAULT_POLL_INTERVAL_MS);
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_POLL_INTERVAL_MS;
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const botId = getRequiredEnv("TEAMGAGA_BOT_ID");
  const client = new TeamGagaClient();
  const pollIntervalMs = getPollIntervalMs();

  console.log(`Dice bot is running. Try: @{!${botId}} roll big`);

  while (true) {
    try {
      const messages = await client.pollMessages();
      for (const message of messages.im) {
        await handleMessage(client, message, botId);
      }
    } catch (error) {
      console.error("Bot loop error:", error);
    }

    await sleep(pollIntervalMs);
  }
}

if (import.meta.main) {
  main();
}
```

- [ ] **Step 2: Keep `sendMessage` reply support**

Ensure `src/teamgaga.ts` keeps this shape:

```ts
async sendMessage({
  channelId,
  content,
  quote_id,
}: {
  channelId: string;
  content: string;
  quote_id?: string;
}): Promise<{ message_id: string }> {
  // body includes channel_id, content, quote_id
}
```

- [ ] **Step 3: Run tests to verify they pass**

Run: `bun test src/bot.test.ts`

Expected: PASS.

### Task 3: Update docs for the dice demo

**Files:**
- Modify: `README.md`
- Modify: `getting-started.md`
- Modify: `.env.sample`

- [ ] **Step 1: Update `.env.sample`**

```text
TEAMGAGA_BOT_ID=<YOUR_BOT_ID>
TEAMGAGA_BOT_TOKEN=<YOUR_BOT_TOKEN>
POLL_INTERVAL_MS=3000
```

- [ ] **Step 2: Update README with run and command examples**

Include:

```md
# TeamGaga Dice Bot Example

This is a small TeamGaga bot demo. It polls channel messages, listens for messages that start with `@{!TEAMGAGA_BOT_ID}`, and replies with a three-dice `big` or `small` game result.

## Run

```bash
bun install
bun run start
```

## Chat Commands

```text
@{!YOUR_BOT_ID} roll big
@{!YOUR_BOT_ID} roll small
```
```

- [ ] **Step 3: Update getting-started to match the dice bot**

Replace the rock-paper-scissors description with the dice game. Explain `TEAMGAGA_BOT_ID`, `TEAMGAGA_BOT_TOKEN`, and how reply messages use `quote_id`.

- [ ] **Step 4: Run full verification**

Run:

```bash
bun test
bun run start
```

Expected: tests pass. `bun run start` starts the polling loop; stop it after seeing the startup log.
