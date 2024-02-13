import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import "./RoundIcon.scss";

interface IRoundIconProps {
    icon: IconDefinition;
}

const RoundIcon: React.FC<IRoundIconProps> = (props) => {
    return (
        <a href="#" className="round-icon">
            <span className="inner"></span>
            {/* <i className="icon-home"></i> */}
            <FontAwesomeIcon icon={props.icon} />
        </a>
    );
};

export default RoundIcon;
