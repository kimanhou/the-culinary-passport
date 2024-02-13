import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import "./FoodPlaceIcons.scss";
import RoundIcon from "components/common/RoundIcon/RoundIcon";

interface IFoodPlaceIconsProps {
    googleMaps?: string;
    instagram?: string;
    website?: string;
}

const FoodPlaceIcons: React.FC<IFoodPlaceIconsProps> = (props) => {
    return (
        <div className="food-place-icons flex-row justify-content-center">
            {props.googleMaps && (
                <a href={props.googleMaps} target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faLocationDot} color={"#f25c54"} />
                </a>
            )}
            {props.instagram && (
                <a href={props.instagram} target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faInstagram} color={"#f25c54"} />
                </a>
            )}
            {props.website && (
                <a href={props.website} target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faLink} color={"#f25c54"} />
                </a>
            )}
            <RoundIcon icon={faInstagram} />
        </div>
    );
};

export default FoodPlaceIcons;
