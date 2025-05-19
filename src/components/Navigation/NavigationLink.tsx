import { FC } from "react";
import { Link, useLocation, matchPath } from "react-router-dom";
import styles from "./NavigationLink.module.scss";

interface INavigationLinkProps {
    to: string;
    children: React.ReactNode;
}

const NavigationLink: FC<INavigationLinkProps> = (props) => {
    const { pathname } = useLocation();
    const selectedClassName = matchPath(pathname, props.to)
        ? styles.selected
        : "";

    return (
        <Link
            className={`${styles.navigationLink} ${selectedClassName}`}
            to={props.to}
        >
            <div className={`${styles.text} ${styles.grey}`}>
                {props.children}
            </div>
            <div className={styles.text}>{props.children}</div>
        </Link>
    );
};

export default NavigationLink;
