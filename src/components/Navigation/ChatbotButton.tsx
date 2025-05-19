import { FC } from "react";
import chatbot from "@/assets/chatbot.png";
import styles from "./ChatbotButton.module.scss";

interface IChatbotButtonProps {
    onClick: () => void;
}

const ChatbotButton: FC<IChatbotButtonProps> = (props) => {
    return (
        <button className={styles.chatbotButton} onClick={props.onClick}>
            <div className={styles.chatbotHoverBackgroundContainer}>
                <div className={styles.chatbotHoverBackground}></div>
            </div>
            <img src={chatbot} />
        </button>
    );
};

export default ChatbotButton;
