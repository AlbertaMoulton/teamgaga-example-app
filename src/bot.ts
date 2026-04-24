import { TeamGagaClient } from "./teamgaga";

const botId = process.env.TEAMGAGA_BOT_ID;
const pollIntervalMs = Number(process.env.POLL_INTERVAL_MS || 3000);

if (!botId) throw new Error("Missing TEAMGAGA_BOT_ID in .env");
if (!process.env.TEAMGAGA_BOT_TOKEN) {
  throw new Error("Missing TEAMGAGA_BOT_TOKEN in .env");
}

const client = new TeamGagaClient();
const mention = `@{!${botId}}`;

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

console.log(`Dice bot is running. Try: ${mention} roll`);

while (true) {
  try {
    const messages = await client.pollMessages();

    for (const message of messages.im) {
      const command = message.content.startsWith(mention)
        ? message.content.slice(mention.length).trim()
        : "";

      if (command !== "roll") continue;

      await client.sendMessage({
        channelId: message.channel_id,
        content: `You rolled ${rollDice()}.`,
        quote_id: message.message_id,
      });
    }
  } catch (error) {
    console.error("Bot loop error:", error);
  }

  await sleep(pollIntervalMs);
}
