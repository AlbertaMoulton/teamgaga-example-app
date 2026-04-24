import { afterEach, expect, mock, test } from "bun:test";
import { TeamGagaClient } from "./teamgaga";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("pollMessages calls the TeamGaga bot messages endpoint", async () => {
  const fetchMock = mock(async () => {
    return new Response(
      JSON.stringify({
        status: true,
        code: 1000,
        message: "Ok",
        data: { im: [], event: [] },
        request_id: "request-id",
      }),
    );
  });
  globalThis.fetch = fetchMock as unknown as typeof fetch;

  const client = new TeamGagaClient();
  await client.pollMessages();

  expect(fetchMock).toHaveBeenCalledWith(
    "https://open.teamgaga.com/bot/v1/messages",
    expect.any(Object),
  );
});

test("pollMessages returns the messages from the API data field", async () => {
  const fetchMock = mock(async () => {
    return new Response(
      JSON.stringify({
        status: true,
        code: 1000,
        message: "Ok",
        data: {
          im: [
            {
              channel_id: "channel_1",
              user_id: "user_1",
              message_id: "message_1",
              channel_type: 0,
              content: "@{!bot_1} roll big",
              created_at: "2026-04-24T00:00:00Z",
            },
          ],
          event: [],
        },
        request_id: "request-id",
      }),
    );
  });
  globalThis.fetch = fetchMock as unknown as typeof fetch;

  const client = new TeamGagaClient();
  const messages = await client.pollMessages();

  expect(messages.im).toHaveLength(1);
  expect(messages.im[0]?.message_id).toBe("message_1");
});
