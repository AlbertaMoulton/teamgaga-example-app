---
title: "Building your first TeamGaga Bot"
date: "2026-03-22"
---

一步一步教你构建你的第一个 `TeamGaga` Bot。

这个示例会做一个简单的骰子游戏：用户在聊天频道里提到 Bot，并发送 `roll big` 或 `roll small`。Bot 会掷 3 个骰子，然后回复用户猜对了还是猜错了。

### 步骤 0：项目设置

如果你还没有安装 `bun`，请先[安装](https://bun.com)它。

克隆示例项目并安装依赖：

```bash
git clone https://github.com/AlbertaMoulton/teamgaga-example-app.git
cd teamgaga-example-app
bun install
```

### 步骤 1：创建并添加应用

##### 创建应用

1. 打开开发者门户并[创建一个应用](https://open.teamgaga.com/applications?new_application=true)。
2. 输入应用名称，然后点击“创建”。
3. 创建后，在应用设置页面找到 Bot 的 ID 和 Token，后面会写入 `.env`。

##### 添加应用到社区

1. 进入“应用测试”页面，把你的社区添加到测试社区列表里。
2. 在 TeamGaga 客户端中进入你的社区，打开 App 市场，把刚创建的应用添加到社区。

### 步骤 2：配置凭据

复制环境变量示例文件：

```bash
cp .env.sample .env
```

然后编辑 `.env`：

```text
TEAMGAGA_BOT_ID=<YOUR_BOT_ID>
TEAMGAGA_BOT_TOKEN=<YOUR_BOT_TOKEN>
POLL_INTERVAL_MS=3000
```

说明：

- `TEAMGAGA_BOT_ID` 用来判断消息是否以 `@{!TEAMGAGA_BOT_ID}` 开头。
- `TEAMGAGA_BOT_TOKEN` 用来调用 TeamGaga Bot API。
- `POLL_INTERVAL_MS` 是轮询间隔，默认可以保持 `3000`。

### 步骤 3：运行 Bot

```bash
bun run start
```

启动后，Bot 会循环调用 `pollMessages()` 拉取频道消息。

### 步骤 4：在聊天频道中玩游戏

在 TeamGaga 聊天频道里发送：

```text
@{!YOUR_BOT_ID} roll big
```

或：

```text
@{!YOUR_BOT_ID} roll small
```

Bot 收到消息后会：

1. 检查消息内容是否以 `@{!TEAMGAGA_BOT_ID}` 开头。
2. 解析命令里的 `roll big` 或 `roll small`。
3. 掷 3 个 1 到 6 点的骰子。
4. 使用 `sendMessage()` 回复消息。

`sendMessage()` 的 `quote_id` 会传入用户消息的 `message_id`，这样 TeamGaga 会把 Bot 的消息显示为对原消息的回复。

游戏规则：

- 总点数 `11` 到 `18` 是 `big`。
- 总点数 `3` 到 `10` 是 `small`。

示例回复：

```text
Dice: 3 + 5 + 6 = 14, result: big. You guessed big. You win!
```
