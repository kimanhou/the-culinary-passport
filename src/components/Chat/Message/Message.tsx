import { FC } from "react";
import { ChatMessageType } from "@/components/Chat/Chat";
import styles from "./Message.module.scss";

interface IMessageProps {
    message: ChatMessageType;
}

const Message: FC<IMessageProps> = ({ message }: IMessageProps) => {
    return (
        <p
            className={`${styles.message} ${
                message.isUser ? styles.fromUser : styles.fromApi
            }`}
        >
            {message.text}
        </p>
    );
};

export default Message;
