// message definition (either from the user or the ai assistant)
export type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

type ChatApiResponse = {
  answer?: string;
  error?: string;
};

const apiBaseUrl =
  import.meta.env.VITE_API_URL || "http://localhost:4242";

// sending message to express server
export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
): Promise<string> {
  // send question and history to backend api
  const response = await fetch(`${apiBaseUrl}/api/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      history,
    }),
  });

  // server response
  const data: ChatApiResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "The assistant could not answer.");
  }

  if (!data.answer) {
    throw new Error("The assistant returned an empty answer.");
  }

  return data.answer;
}