import { Bot } from "@teamgaga/open-api";

const botToken = process.env.TEAMGAGA_BOT_TOKEN;
const botId = process.env.TEAMGAGA_BOT_ID;
if (!botToken) throw new Error("Missing TEAMGAGA_BOT_TOKEN in .env");
if (!botId) throw new Error("Missing TEAMGAGA_BOT_ID in .env");

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot(botToken);

// Handle messages.
bot.on("message", async (ctx) => {
  // pretty print the message object to the console
  console.log(JSON.stringify(ctx.message, null, 2));
  if (ctx.text?.includes("roll")) {
    const point = Math.floor(Math.random() * 6) + 1;
    await ctx.reply(`你的点数是 ${point}.`);
  }
});


// Start the bot.
bot.start();