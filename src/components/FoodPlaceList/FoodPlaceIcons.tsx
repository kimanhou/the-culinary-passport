import React from "react";
import "./FoodPlaceIcons.scss";
import googleMaps from "./googleMaps.png";
import instagram from "./instagram.png";
import website from "./website.png";

interface IFoodPlaceIconsProps {
    googleMaps?: string;
    instagram?: string;
    website?: string;
}

const FoodPlaceIcons: React.FC<IFoodPlaceIconsProps> = (props) => {
    return (
        <div className="food-place-icons flex-row">
            {props.googleMaps && (
                <a href={props.googleMaps} target="_blank" rel="noreferrer">
                    <img
                        src={googleMaps}
                        className="food-place-icons-icon food-place-icons-google-maps"
                        alt="Google Maps icon"
                    />
                </a>
            )}
            {props.instagram && (
                <a href={props.instagram} target="_blank" rel="noreferrer">
                    <img
                        src={instagram}
                        className="food-place-icons-icon food-place-icons-instagram"
                        alt="Instagram icon"
                    />
                </a>
            )}
            {props.website && (
                <a href={props.website} target="_blank" rel="noreferrer">
                    <img
                        src={website}
                        className="food-place-icons-icon food-place-icons-website"
                        alt="Website icon"
                    />
                </a>
            )}
        </div>
    );
};

export default FoodPlaceIcons;
