import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import "./RoundIcon.scss";

interface IRoundIconProps {
    icon: IconDefinition;
    href: string;
}

const RoundIcon: React.FC<IRoundIconProps> = (props) => {
    return (
        <a
            className="round-icon"
            href={props.href}
            target="_blank"
            rel="noreferrer"
        >
            <span className="round-icon-inner"></span>
            <FontAwesomeIcon icon={props.icon} />
        </a>
    );
};

export default RoundIcon;
