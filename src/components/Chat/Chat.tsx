import { Dispatch, FC, SetStateAction, useEffect, useRef } from "react";
import MessageInput from "@/components/Chat/MessageInput/MessageInput";
import Message from "@/components/Chat/Message/Message";
import { addMessageInDb, initDb } from "@/ts/indexedDbUtils";
import styles from "./Chat.module.scss";

export type ChatMessageType = {
    text: string;
    isUser: boolean;
    id: number;
};

interface IChatProps {
    close: () => void;
    messages: ChatMessageType[];
    setMessages: Dispatch<SetStateAction<ChatMessageType[]>>;
}

const Chat: FC<IChatProps> = (props) => {
    const chatContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initDbAsyncFunc = async () => {
            await initDb();
        };
        initDbAsyncFunc();
    }, []);

    const addMessage = (message: ChatMessageType) => {
        props.setMessages([...props.messages, message]);
        addMessageInDb(message);
    };

    useEffect(() => {
        if (chatContentRef.current) {
            const isScrolledToBottom =
                chatContentRef.current.scrollHeight -
                    chatContentRef.current.clientHeight <=
                chatContentRef.current.scrollTop + 1;
            if (!isScrolledToBottom) {
                chatContentRef.current.scrollTop =
                    chatContentRef.current.scrollHeight -
                    chatContentRef.current.clientHeight;
            }
        }
    }, [props.messages]);

    return (
        <div className={styles.chat}>
            <div className={styles.chatContent} ref={chatContentRef}>
                {props.messages.map((message, index) => (
                    <Message key={index} message={message} />
                ))}
            </div>
            <MessageInput addMessage={addMessage} />
        </div>
    );
};

export default Chat;
