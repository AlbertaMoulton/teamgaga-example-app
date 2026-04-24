import { TeamGagaClient } from "./teamgaga";
import type { MessageStruct } from "./type";

type Guess = "big" | "small";

const DEFAULT_POLL_INTERVAL_MS = 3000;

export function getMentionCommand(
  content: string,
  botId: string,
): string | null {
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

async function reply(
  client: TeamGagaClient,
  message: MessageStruct,
  content: string,
) {
  await client.sendMessage({
    channelId: message.channel_id,
    content,
    quote_id: message.message_id,
  });
}

async function handleMessage(
  client: TeamGagaClient,
  message: MessageStruct,
  botId: string,
) {
  const command = getMentionCommand(message.content, botId);
  if (command === null) return;

  const guess = parseRollCommand(command);
  const content =
    guess === null ? buildHelpMessage() : buildGameMessage(guess, rollDice());

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
  getRequiredEnv("TEAMGAGA_BOT_TOKEN");

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
