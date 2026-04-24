# TeamGaga Dice Bot Example

A tiny TeamGaga bot demo for beginners. It polls channel messages, listens for messages that start with `@{!TEAMGAGA_BOT_ID}`, and replies to `roll` with a dice result.

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

## Chat Command

```text
@{!YOUR_BOT_ID} roll
```

Example reply:

```text
You rolled 4.
```
