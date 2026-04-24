import type { PullMessageResp, TeamGagaApiResp } from "./type";

const TEAMGAGA_API_BASE_URL = "https://open.teamgaga.com";

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
      `${TEAMGAGA_API_BASE_URL}/bot/v1/messages`,
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

    const result = (await response.json()) as TeamGagaApiResp<PullMessageResp>;
    return result.data;
  }

  async sendMessage({
    channelId,
    content,
    quote_id,
  }: {
    channelId: string;
    content: string;
    quote_id?: string; // 来自监听到的消息的 message_id，如果是回复消息则必填
  }): Promise<{ message_id: string }> {
    const response = await fetch(
      `${TEAMGAGA_API_BASE_URL}/bot/v1/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel_id: channelId,
          content,
          quote_id,
          type: MessageType.TEXT,
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
