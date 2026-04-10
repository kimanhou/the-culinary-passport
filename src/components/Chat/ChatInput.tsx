import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { isValidMessage } from "model/ChatMessage";
import "./ChatInput.scss";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!isValidMessage(input) || disabled) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        className="chat-input-field"
        placeholder="Ask about restaurants..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button
        className="chat-send-button"
        onClick={handleSend}
        disabled={disabled || !isValidMessage(input)}
        aria-label="Send message"
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </div>
  );
};

export default ChatInput;
