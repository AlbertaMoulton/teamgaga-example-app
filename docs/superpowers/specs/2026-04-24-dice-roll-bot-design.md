# Dice Roll Bot Demo Design

## Goal

Build a compact TeamGaga bot demo for beginners. The demo shows how to poll channel messages, detect messages that mention the bot, parse a simple command, and reply with `sendMessage` using `quote_id`.

## User Command

Users trigger the game with:

```text
@{!TEAMGAGA_BOT_ID} roll big
@{!TEAMGAGA_BOT_ID} roll small
```

Any other mentioned command gets a short help reply.

## Game Rules

The bot rolls three six-sided dice.

- Total `11` to `18` is `big`.
- Total `3` to `10` is `small`.
- If the user's guess matches the result, the user wins.

Example reply:

```text
Dice: 3 + 5 + 6 = 14, result: big. You guessed big. You win!
```

## Architecture

Keep the project beginner-friendly:

- `src/teamgaga.ts` stays focused on TeamGaga API calls.
- `src/bot.ts` contains the demo loop and a few small helper functions.
- No command framework, database, or extra dependency is needed.

The bot loop:

1. Read `TEAMGAGA_BOT_ID`, `TEAMGAGA_BOT_TOKEN`, and optional `POLL_INTERVAL_MS`.
2. Poll messages with `client.pollMessages()`.
3. For each `im` message, check whether `content` starts with `@{!TEAMGAGA_BOT_ID}`.
4. Parse the remaining text as a command.
5. Reply with `sendMessage`, passing the source `message_id` as `quote_id`.
6. Wait, then poll again.

## Error Handling

Startup fails fast if required environment variables are missing.

Polling and sending errors are logged, then the bot keeps running. This keeps the example easy to run while showing a realistic long-running bot shape.

## Testing

Add focused tests for pure helpers where useful:

- Mention detection.
- Command parsing.
- Dice result classification.

Avoid mocking the full TeamGaga API unless the implementation grows larger.
