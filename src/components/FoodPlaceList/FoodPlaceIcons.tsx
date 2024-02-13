import React from "react";
import { faLink, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import RoundIcon from "components/common/RoundIcon/RoundIcon";
import "./FoodPlaceIcons.scss";

interface IFoodPlaceIconsProps {
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
        </div>
    );
};

export default FoodPlaceIcons;
