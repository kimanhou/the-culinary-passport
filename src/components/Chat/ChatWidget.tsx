import React, { useState } from "react";
import ChatButton from "components/Chat/ChatButton";
import ChatPanel from "components/Chat/ChatPanel";
import FoodPlace from "model/FoodPlace";

interface ChatWidgetProps {
  cityName: string;
  foodPlaces: FoodPlace[];
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ cityName, foodPlaces }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) {
    return (
      <ChatPanel
        cityName={cityName}
        foodPlaces={foodPlaces}
        onClose={() => setIsOpen(false)}
      />
    );
  }

  return <ChatButton onClick={() => setIsOpen(true)} />;
};

export default ChatWidget;
