import { ChatMessageType } from "@/components/Chat/Chat";

let db: IDBDatabase;
let version = 1;
const DB_NAME = "culinaryPassportDb";
const INITIAL_CHAT_MESSAGE = {
    text: "Hello! How can I help you today?",
    isUser: false,
};

export enum Stores {
    ChatMessages = "ChatMessages",
}

export const initDb = (): Promise<boolean> => {
    return new Promise((resolve) => {
        // open the connection
        const request = indexedDB.open(DB_NAME);

        request.onupgradeneeded = () => {
            db = request.result;

            // if the data object store doesn't exist, create it
            if (!db.objectStoreNames.contains(Stores.ChatMessages)) {
                db.createObjectStore(Stores.ChatMessages, { keyPath: "id" });
                const id = Date.now();
                addData(Stores.ChatMessages, {
                    ...INITIAL_CHAT_MESSAGE,
                    id,
                });
            }
        };

        request.onsuccess = () => {
            if (request) {
                db = request.result;
                version = db.version;
                resolve(true);
            }
        };

        request.onerror = () => {
            resolve(false);
        };
    });
};

const addData = <T>(storeName: string, data: T): Promise<T | string | null> => {
    return new Promise((resolve) => {
        const request = indexedDB.open(DB_NAME, version);

        request.onsuccess = () => {
            db = request.result;
            const tx = db.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);
            store.add(data);
            resolve(data);
        };

        request.onerror = () => {
            const error = request.error?.message;
            if (error) {
                resolve(error);
            } else {
                resolve("Unknown error");
            }
        };
    });
};

const getStoreData = <T>(storeName: Stores): Promise<T[]> => {
    return new Promise((resolve) => {
        const request = indexedDB.open(DB_NAME);

        request.onsuccess = () => {
            db = request.result;
            const tx = db.transaction(storeName, "readonly");
            const store = tx.objectStore(storeName);
            const res = store.getAll();
            res.onsuccess = () => {
                resolve(res.result);
            };
        };
    });
};

export const getAllMessagesFromDb = async () => {
    try {
        return (await getStoreData(Stores.ChatMessages)) as ChatMessageType[];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.log(err.message);
        } else {
            console.log(
                "Something went wrong while getting all chat messages from db."
            );
        }
    }
};

export const addMessageInDb = async (message: ChatMessageType) => {
    const id = Date.now();

    try {
        await addData(Stores.ChatMessages, { ...message, id });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.log(err.message);
        } else {
            console.log(
                `Something went wrong while add chat message to db: ${message.text}`
            );
        }
    }
};
