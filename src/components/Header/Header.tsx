import { FC } from "react";
import City from "@/model/City";
import Navigation from "@/components/Navigation/Navigation";
import Divider from "@/components/common/Divider/Divider";
import { useIsMobile } from "@/hooks/useIsMobile";
import styles from "./Header.module.scss";

interface IHeaderProps {
    cities: City[];
}

export const Header: FC<IHeaderProps> = (props) => {
    const isMobile = useIsMobile();

    return (
        <header className={styles.header}>
            <div className={styles.tagLine}>
                <div className={`${styles.tagLineDecoration} ${styles.left}`} />
                <h4>
                    <i>sibling edition</i>
                </h4>
                <div
                    className={`${styles.tagLineDecoration} ${styles.right}`}
                />
            </div>

            <h1>
                <a href="./">Culinary passport</a>
            </h1>
            {!isMobile && <Navigation cities={props.cities} />}
            <Divider />
        </header>
    );
};
