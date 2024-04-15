import React from "react";
import { faLink, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import RoundIcon from "components/common/RoundIcon/RoundIcon";
import "./FoodPlaceIcons.scss";
import ShareIcon from "./ShareIcon";
import { ToastNotificationEnum } from "ts/enum";

interface IFoodPlaceIconsProps {
    showToast: (message: string, type: ToastNotificationEnum) => void;
    fullScreenLink: string;
    googleMaps?: string;
    instagram?: string;
    website?: string;
}

const FoodPlaceIcons: React.FC<IFoodPlaceIconsProps> = (props) => {
    return (
        <div className="food-place-icons flex-row justify-content-center">
            {props.googleMaps && (
                <RoundIcon icon={faLocationDot} href={props.googleMaps} />
            )}
            {props.instagram && (
                <RoundIcon icon={faInstagram} href={props.instagram} />
            )}
            {props.website && <RoundIcon icon={faLink} href={props.website} />}
            <ShareIcon
                link={props.fullScreenLink}
                showToast={props.showToast}
            />
        </div>
    );
};

export default FoodPlaceIcons;
