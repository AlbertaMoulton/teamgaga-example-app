import { TeamGagaClient } from "./teamgaga";

async function main() {
  const client = new TeamGagaClient();
  try {
    const messages = await client.pollMessages();
    console.log("Fetched messages:", messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
}

main();
