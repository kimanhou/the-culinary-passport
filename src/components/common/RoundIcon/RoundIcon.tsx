import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import styles from "./RoundIcon.module.scss";

interface IRoundIconProps {
    icon: IconDefinition;
    href: string;
}

const RoundIcon: FC<IRoundIconProps> = (props) => {
    return (
        <a
            className={styles.roundIcon}
            href={props.href}
            target="_blank"
            rel="noreferrer"
        >
            <span className={styles.roundIconInner}></span>
            <FontAwesomeIcon icon={props.icon} />
        </a>
    );
};

export default RoundIcon;
