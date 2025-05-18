import { FC } from "react";
import City from "@/model/City";
import NavigationLink from "@/components/Navigation/NavigationLink";
import styles from "./Navigation.module.scss";

interface INavigationProps {
    cities: City[];
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
        </div>
    );
};

export default Navigation;
