import { Dispatch, FC, SetStateAction } from "react";
import City from "@/model/City";
import NavigationLink from "@/components/Navigation/NavigationLink";
import ChatbotButton from "@/components/Navigation/ChatbotButton";
import styles from "./Navigation.module.scss";

interface INavigationProps {
    cities: City[];
    setIsChatVisible: Dispatch<SetStateAction<boolean>>;
}

const Navigation: FC<INavigationProps> = (props) => {
    return (
        <div className={styles.navigation}>
            {props.cities.map((t) => (
                <NavigationLink
                    to={`/${t.name.toLocaleLowerCase()}`}
                    key={t.name}
                >
                    {t.name.toLocaleUpperCase()}
                </NavigationLink>
            ))}
            <ChatbotButton onClick={() => props.setIsChatVisible((t) => !t)} />
        </div>
    );
};

export default Navigation;
