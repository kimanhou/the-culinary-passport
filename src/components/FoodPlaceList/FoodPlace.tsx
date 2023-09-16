import React from "react";
import FoodPlaceModel from "../../model/FoodPlace";
import "./FoodPlace.scss";
import FoodPlaceIcons from "./FoodPlaceIcons";
import FoodPlaceTags from "./FoodPlaceTags";
import FoodPlaceImages from './FoodPlaceImages';

interface IFoodPlaceProps {
    foodPlace: FoodPlaceModel;
}

const FoodPlace: React.FC<IFoodPlaceProps> = (props) => {
    return (
        <div className={`food-place`}>
            <h3>{props.foodPlace.name}</h3>
            <FoodPlaceImages images={[props.foodPlace.images]} />
            <p>{props.foodPlace.description}</p>
            <FoodPlaceIcons
                googleMaps={props.foodPlace.googleMaps}
                instagram={props.foodPlace.instagram}
                website={props.foodPlace.website}
            />
            <FoodPlaceTags tags={props.foodPlace.tags} />
            <div className="food-place-bottom-line" />
        </div>
    );
};

export default FoodPlace;
