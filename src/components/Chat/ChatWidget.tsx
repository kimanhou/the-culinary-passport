import React, { useState } from "react";
import ChatButton from "components/Chat/ChatButton";
import ChatPanel from "components/Chat/ChatPanel";
import FoodPlace from "model/FoodPlace";
import { ToastNotificationEnum } from "ts/enum";

interface ChatWidgetProps {
  cityName: string;
  foodPlaces: FoodPlace[];
  onLike?: (foodPlaceId: number) => void;
  showToast?: (message: string, type: ToastNotificationEnum) => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ cityName, foodPlaces, onLike, showToast }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) {
    return (
      <ChatPanel
        cityName={cityName}
        foodPlaces={foodPlaces}
        onClose={() => setIsOpen(false)}
        onLike={onLike}
        showToast={showToast}
      />
    );
  }

  return <ChatButton onClick={() => setIsOpen(true)} />;
};

export default ChatWidget;
