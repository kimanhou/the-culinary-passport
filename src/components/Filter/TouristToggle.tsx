import React, { FC } from "react";
import { StayEnum } from "ts/enum";
import tourist from "assets/tourist.png";
import local from "assets/local.png";
import "./TouristToggle.scss";
import Toggle from "components/common/Toggle/Toggle";

interface ITouristToggle {
    stayType: string;
    onStayTypeChange: () => void;
    disabled: boolean;
}

const TouristToggle: FC<ITouristToggle> = (props) => {
    const isTourist = props.stayType === StayEnum.TOURIST;
    const disabledClassName = props.disabled ? "disabled" : "";

    return (
        <div
            className={`tourist-toggle align-items-center ${disabledClassName}`}
        >
            <div
                className="flex-column align-items-center"
                style={{ gap: "5px" }}
            >
                <img src={local} alt="Local icon" />
                <span className="toggle-label">I live here</span>
            </div>
            <Toggle
                checked={isTourist}
                onChange={props.onStayTypeChange}
                disabled={props.disabled}
            />
            <div
                className="flex-column align-items-center"
                style={{ gap: "5px" }}
            >
                <img src={tourist} alt="Tourist icon" />
                <span className="toggle-label">I'm visiting</span>
            </div>
        </div>
    );
};

export default TouristToggle;
