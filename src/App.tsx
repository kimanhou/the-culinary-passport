import { useEffect, useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import Home from "@/components/Home/Home";
import City from "@/components/City/City";
import Chat, { ChatMessageType } from "@/components/Chat/Chat";
import BottomNotification from "@/components/common/BottomNotification/BottomNotification";
import CityModel from "@/model/City";
import { useIsMobile } from "@/hooks/useMedia";
import { getAllMessagesFromDb, initDb } from "@/ts/indexedDbUtils";
import styles from "./App.module.scss";

function App() {
    const isMobile = useIsMobile();
    const [cities, setCities] = useState<CityModel[]>([]);
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);

    useEffect(() => {
        fetch("./cities.json")
            .then((response) => response.json())
            .then((json) => json.map((x: any) => CityModel.deserialize(x)))
            .then((t) => setCities(t));
    }, []);

    useEffect(() => {
        const initDbAsyncFunc = async () => {
            await initDb();
            const messagesFromDb = await getAllMessagesFromDb();
            if (messagesFromDb !== undefined) {
                setChatMessages(messagesFromDb);
            }
        };
        initDbAsyncFunc();
    }, []);

    return (
        <div className={styles.appContainer}>
            <HashRouter>
                <Header cities={cities} setIsChatVisible={setIsChatVisible} />
                <Routes>
                    {cities.map((t) => (
                        <Route
                            path={`/${t.name.toLocaleLowerCase()}`}
                            element={<City city={t} />}
                            key={t.name}
                        ></Route>
                    ))}

                    {cities.map((t) => (
                        <Route
                            path={`/${t.name.toLocaleLowerCase()}/:foodPlaceId`}
                            element={<City city={t} isFullScreen={!isMobile} />}
                            key={t.name}
                        ></Route>
                    ))}

                    <Route
                        path={"/"}
                        element={<Home cities={cities} />}
                    ></Route>
                </Routes>
                <Footer />

                <BottomNotification
                    isVisible={isChatVisible}
                    setIsVisible={setIsChatVisible}
                    withBackdrop
                >
                    <Chat
                        close={() => setIsChatVisible(false)}
                        messages={chatMessages}
                        setMessages={setChatMessages}
                    />
                </BottomNotification>
            </HashRouter>
        </div>
    );
}

export default App;
