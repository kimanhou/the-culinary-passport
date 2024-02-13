import React from "react";
import FoodPlaceModel from "model/FoodPlace";
import FoodPlaceTags from "./FoodPlaceTags";
import "./FoodPlaceCard.scss";
import FoodPlaceIcons from "./FoodPlaceIcons";

interface IFoodPlaceCardProps {
    foodPlace: FoodPlaceModel;
}

const FoodPlaceCard: React.FC<IFoodPlaceCardProps> = (props) => {
    const foodPlaceId = `food-place-${props.foodPlace.name
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .replace(/'/g, "")
        .replace(/\s+/g, "-")
        .toLocaleLowerCase()}`;

    return (
        <div className="food-place-card" id={`food-place-card-${foodPlaceId}`}>
            <div className="food-place-card-content flex-column">
                <h5>{props.foodPlace.neighborhood}</h5>
                <h3>{props.foodPlace.name}</h3>
                <FoodPlaceTags
                    tags={[
                        ...props.foodPlace.tags,
                        ...props.foodPlace.typeOfCuisine,
                        props.foodPlace.price,
                    ].filter((t) => t !== "")}
                />
                <p>{props.foodPlace.description}</p>
                <FoodPlaceIcons
                    googleMaps={props.foodPlace.googleMaps}
                    instagram={props.foodPlace.instagram}
                    website={props.foodPlace.website}
                />
            </div>
        </div>
    );
};

export default FoodPlaceCard;
