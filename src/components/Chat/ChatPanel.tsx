import React, { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { ChatMessage, buildWelcomeMessage } from "model/ChatMessage";
import { sendMessage } from "api/MistralService";
import { buildSystemPrompt } from "api/buildSystemPrompt";
import ChatInput from "components/Chat/ChatInput";
import { formatMessage } from "components/Chat/formatMessage";
import FoodPlace from "model/FoodPlace";
import "./ChatPanel.scss";

interface ChatPanelProps {
  cityName: string;
  foodPlaces: FoodPlace[];
  onClose: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ cityName, foodPlaces, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const apiUrl = process.env.REACT_APP_CHAT_API_URL;
  const isAvailable = Boolean(apiUrl);

  useEffect(() => {
    setMessages([buildWelcomeMessage(cityName)]);
  }, [cityName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = useCallback(async (content: string) => {
    const userMessage: ChatMessage = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const systemPrompt = buildSystemPrompt(cityName, foodPlaces);
      const systemMessage: ChatMessage = { role: "system", content: systemPrompt };
      const apiMessages = [systemMessage, ...messages, userMessage];

      const response = await sendMessage(apiMessages);
      const assistantMessage: ChatMessage = { role: "assistant", content: response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, I couldn't process your request. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [cityName, foodPlaces, messages]);

  return (
    <div className="chat-panel">
      <div className="chat-panel-header">
        <span className="chat-panel-title">Restaurant Guide</span>
        <button className="chat-panel-close" onClick={onClose} aria-label="Close chat">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      <div className="chat-panel-messages">
        {!isAvailable && (
          <div className="chat-unavailable">
            Chat is currently unavailable. Please try again later.
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message chat-message--${msg.role}`}>
            {formatMessage(msg.content)}
          </div>
        ))}
        {isLoading && (
          <div className="chat-message chat-message--assistant chat-typing-indicator">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={handleSend} disabled={!isAvailable || isLoading} />
    </div>
  );
};

export default ChatPanel;
