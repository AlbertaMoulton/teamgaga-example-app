import type { PullMessageResp } from "./type";

const MessageType = {
  TEXT: 0,
  AUDIO: 1,
  RICH_TEXT: 7,
  FILES: 13,
} as const;

export class TeamGagaClient {
  private token: string;
  constructor() {
    this.token = process.env.TEAMGAGA_BOT_TOKEN || "";
  }

  // Fetch messages from TeamGaga API
  async pollMessages(): Promise<PullMessageResp> {
    const response = await fetch(
      `https://open.teamgaga.com/api/v1/bot/messages`,
      {
        method: "GET",
        headers: {
          Authorization: `Bot ${this.token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`pollMessages error! status: ${response.status}`);
    }

    const data = (await response.json()) as PullMessageResp;
    return data;
  }

  async sendMessage({
    channelId,
    content,
  }: {
    channelId: string;
    content: string;
  }): Promise<{ message_id: string }> {
    const response = await fetch(
      `https://open.teamgaga.com/api/v2/bot/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel_id: channelId,
          content,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`sendMessage error! status: ${response.status}`);
    }

    const data = (await response.json()) as { message_id: string };
    return data;
  }
}
