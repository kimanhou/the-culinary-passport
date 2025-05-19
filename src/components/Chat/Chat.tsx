import { FC, useState } from "react";
import MessageInput from "@/components/Chat/MessageInput/MessageInput";
import Message from "@/components/Chat/Message/Message";
import styles from "./Chat.module.scss";

export type ChatMessageType = {
    text: string;
    isUser: boolean;
};

interface IChatProps {
    close: () => void;
}

const Chat: FC<IChatProps> = () => {
    const [messages, setMessages] = useState<ChatMessageType[]>([
        { isUser: false, text: "Hello! How can I help you today?" },
    ]);

    const addMessage = (message: ChatMessageType) => {
        setMessages([...messages, message]);
    };

    return (
        <div className={styles.chat}>
            <div className={styles.chatContent}>
                {messages.map((message, index) => (
                    <Message key={index} message={message} />
                ))}
            </div>
            <MessageInput addMessage={addMessage} />
        </div>
    );
};

export default Chat;
