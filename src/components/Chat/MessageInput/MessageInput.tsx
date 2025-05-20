import { FC, useState } from "react";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChatMessageType } from "@/components/Chat/Chat";
import styles from "./MessageInput.module.scss";

interface IMessageInputProps {
    addMessage: (message: ChatMessageType) => void;
}

const MessageInput: FC<IMessageInputProps> = ({
    addMessage,
}: IMessageInputProps) => {
    const [sendIconClassName, setSendIconClassName] = useState("");
    const [messageValue, setMessageValue] = useState("");
    const isSendDisabledClassName = messageValue === "" ? styles.disabled : "";

    const onClickSend = () => {
        if (messageValue === "") return;

        setSendIconClassName(styles.sendIconAnimation);
        setTimeout(() => {
            setSendIconClassName("");
        }, 600);

        addMessage({ text: messageValue, isUser: true });
        setMessageValue("");
    };

    return (
        <div className={styles.messageInput}>
            <input
                type="text"
                placeholder="Type a message..."
                className={styles.input}
                value={messageValue}
                onChange={(e) => setMessageValue(e.currentTarget.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onClickSend();
                    }
                }}
            />
            <button
                className={`${styles.sendButton} ${isSendDisabledClassName}`}
                onClick={onClickSend}
            >
                <div
                    className={`${styles.sendIconContainer} ${sendIconClassName}`}
                >
                    <FontAwesomeIcon
                        icon={faPaperPlane}
                        className={styles.sendIcon}
                    />
                </div>
            </button>
        </div>
    );
};

export default MessageInput;
