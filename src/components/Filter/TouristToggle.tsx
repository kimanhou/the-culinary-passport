import React, { FC } from "react";
import { StayEnum } from "ts/enum";
import tourist from "assets/tourist.png";
import local from "assets/local.png";
import "./TouristToggle.scss";

interface ITouristToggle {
    stayType: string;
    onStayTypeChange: () => void;
}

const TouristToggle: FC<ITouristToggle> = (props) => {
    const isTourist = props.stayType === StayEnum.TOURIST;

    return (
        <>
            <input
                type="checkbox"
                checked={isTourist}
                onChange={props.onStayTypeChange}
            />
            {isTourist && (
                <>
                    <img src={tourist} alt="Tourist icon" />
                    <span>I'm visiting</span>
                </>
            )}
            {!isTourist && (
                <>
                    <img src={local} alt="Local icon" />
                    <span>I live here</span>
                </>
            )}
        </>
    );
};

export default TouristToggle;
