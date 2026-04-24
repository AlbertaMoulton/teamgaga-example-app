# TeamGaga Dice Bot Example

This is a small TeamGaga bot demo for beginners. It polls channel messages, listens for messages that start with `@{!TEAMGAGA_BOT_ID}`, and replies with a three-dice `big` or `small` game result.

## Setup

```bash
bun install
cp .env.sample .env
```

Fill in `.env`:

```text
TEAMGAGA_BOT_ID=<YOUR_BOT_ID>
TEAMGAGA_BOT_TOKEN=<YOUR_BOT_TOKEN>
POLL_INTERVAL_MS=3000
```

## Run

```bash
bun run start
```

## Chat Commands

```text
@{!YOUR_BOT_ID} roll big
@{!YOUR_BOT_ID} roll small
```

The bot rolls three dice. Totals from `11` to `18` are `big`, and totals from `3` to `10` are `small`.
