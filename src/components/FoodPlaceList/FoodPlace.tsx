import React from "react";
import FoodPlaceModel from "../../model/FoodPlace";
import "./FoodPlace.scss";
import FoodPlaceIcons from "./FoodPlaceIcons";
import FoodPlaceTags from "./FoodPlaceTags";
import FoodPlaceImages from "./FoodPlaceImages";

interface IFoodPlaceProps {
    foodPlace: FoodPlaceModel;
}

const FoodPlace: React.FC<IFoodPlaceProps> = (props) => {
    return (
        <div className={`food-place`} id={`food-place-${props.foodPlace.name}`}>
            <div className="food-place-container flex-row">
                {props.foodPlace.images && (
                    <FoodPlaceImages
                        images={props.foodPlace.images}
                        foodPlaceName={props.foodPlace.name}
                    />
                )}
                <div className="food-place-content">
                    <div className="food-place-content-header flex-row">
                        <h3>{props.foodPlace.name}</h3>
                        <FoodPlaceIcons
                            neighborhood={props.foodPlace.neighborhood}
                            googleMaps={props.foodPlace.googleMaps}
                            instagram={props.foodPlace.instagram}
                            website={props.foodPlace.website}
                        />
                    </div>

                    <p>{props.foodPlace.description}</p>
                    <FoodPlaceTags
                        tags={[
                            ...props.foodPlace.tags,
                            ...props.foodPlace.typeOfCuisine,
                            props.foodPlace.price,
                        ].filter((t) => t !== "")}
                    />
                </div>
            </div>

            <div className="food-place-bottom-line" />
        </div>
    );
};

export default FoodPlace;
