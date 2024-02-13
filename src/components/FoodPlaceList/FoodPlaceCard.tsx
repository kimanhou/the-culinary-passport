import React from "react";
import FoodPlaceModel from "model/FoodPlace";
import FoodPlaceTags from "./FoodPlaceTags";
import FoodPlaceIcons from "./FoodPlaceIcons";
import FoodPlaceImages from "./FoodPlaceImages";
import { getFoodPlaceId } from "utils";
import "./FoodPlaceCard.scss";

interface IFoodPlaceCardProps {
    foodPlace: FoodPlaceModel;
}

const FoodPlaceCard: React.FC<IFoodPlaceCardProps> = (props) => {
    const foodPlaceId = getFoodPlaceId(props.foodPlace.name);

    return (
        <div className="food-place-card" id={`food-place-${foodPlaceId}`}>
            {props.foodPlace.images && (
                <FoodPlaceImages
                    images={props.foodPlace.images}
                    foodPlaceName={props.foodPlace.name}
                    foodPlaceId={foodPlaceId}
                />
            )}

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
