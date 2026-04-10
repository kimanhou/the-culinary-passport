import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import "./ChatButton.scss";

interface ChatButtonProps {
  onClick: () => void;
}

const ChatButton: React.FC<ChatButtonProps> = ({ onClick }) => {
  return (
    <button className="chat-button" onClick={onClick} aria-label="Open chat">
      <FontAwesomeIcon icon={faComments} />
    </button>
  );
};

export default ChatButton;
