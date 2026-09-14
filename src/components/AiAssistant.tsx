import { useState, type FormEvent } from "react";

import {
  sendChatMessage,
  type ChatMessage,
} from "../services/aiAssistantService";

import "./AiAssistant.css";

const welcomeMessage: ChatMessage = {
  role: "assistant",
  text: "Hi! Ask me to help you find a product.",
};

function AiAssistant() {
  // check if the chat window is visible
  const [isOpen, setIsOpen] = useState(false);

  // hold the list of chat messages so far
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);

  const [input, setInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = input.trim();

    if (!message || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      role: "user",
      text: message,
    };

    // keep only the last 6 messages for history
    const history = messages.slice(-6);

    // append the user's message to the existing message list
    setMessages([...messages, userMessage]);

    setInput("");
    setIsLoading(true);

    try {
      const answer = await sendChatMessage(message, history);

      // add ai's answer to the message list
      setMessages([
        ...messages,
        userMessage,
        { role: "assistant", text: answer },
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "The assistant could not answer right now.";

      setMessages([
        ...messages,
        userMessage,
        { role: "assistant", text: errorMessage },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="ai-assistant">
      {isOpen && (
        <section className="ai-chat-panel" aria-label="QuickCart assistant">
          <header className="ai-chat-header">
            <span>QuickCart Assistant</span>
            <button
              type="button"
              className="ai-close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
            >
              ×
            </button>
          </header>

          <div className="ai-chat-messages">
            {messages.map((chatMessage, index) => (
              <p
                key={`${chatMessage.role}-${index}`}
                className={`ai-message ai-message-${chatMessage.role}`}
              >
                {chatMessage.text}
              </p>
            ))}

            {isLoading && (
              <p className="ai-message ai-message-assistant">Thinking...</p>
            )}
          </div>

          <form className="ai-chat-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about products..."
              maxLength={500}
              disabled={isLoading}
              aria-label="Ask a product question"
            />

            <button type="submit" disabled={isLoading || !input.trim()}>
              Send
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="ai-open-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open QuickCart assistant"
      >
        Ask QuickCart
      </button>
    </div>
  );
}

export default AiAssistant;
