import { Bot } from "@teamgaga/sdk";

const botToken = process.env.TEAMGAGA_BOT_TOKEN;
const botId = process.env.TEAMGAGA_BOT_ID;

if (!botToken) throw new Error("Missing TEAMGAGA_BOT_TOKEN in .env");
if (!botId) throw new Error("Missing TEAMGAGA_BOT_ID in .env");

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot(botToken);

// somebody is mentioning me
const mention = `@{!${botId}}`;

// Handle messages.
bot.on("message", async (ctx) => {
  const command = ctx.text.startsWith(mention)
    ? ctx.text.slice(mention.length).trim()
    : "";

  if (command !== "roll") return;

  const point = Math.floor(Math.random() * 6) + 1;
  await ctx.reply(`You rolled ${point}.`);
});

console.log(`Dice bot is running. Try: ${mention} roll`);

// Start the bot.
bot.start({
  pollInterval: Number(process.env.POLL_INTERVAL_MS || 3000),
});
