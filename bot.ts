import { Bot } from "@teamgaga/open-api";

const botToken = process.env.TEAMGAGA_BOT_TOKEN;
const botId = process.env.TEAMGAGA_BOT_ID;
if (!botToken) throw new Error("Missing TEAMGAGA_BOT_TOKEN in .env");
if (!botId) throw new Error("Missing TEAMGAGA_BOT_ID in .env");

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot(botToken);

// Handle messages.
bot.on("message", async (ctx) => {
  if (ctx.text.includes("roll the dice")) {
    const point = Math.floor(Math.random() * 6) + 1;
    await ctx.reply(`You rolled ${point}.`);
  } else {
    await ctx.reply("Try: roll the dice");
  }
});

console.log(`Dice bot is running. Try: roll the dice`);

// Start the bot.
bot.start({
  pollInterval: Number(process.env.POLL_INTERVAL_MS || 3000),
});