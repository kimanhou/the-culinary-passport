import React from "react";
import FoodPlaceModel from "../../model/FoodPlace";
import FoodPlace from "./FoodPlace";
import "./FoodPlaceList.scss";

interface IFoodPlaceListProps {
    foodPlaceList: FoodPlaceModel[];
}

const FoodPlaceList: React.FC<IFoodPlaceListProps> = (props) => {
    return (
        <ul className="food-place-list">
            {props.foodPlaceList.map((t) => (
                <li key={t.name}>
                    <FoodPlace foodPlace={t} />
                </li>
            ))}
        </ul>
    );
};

export default FoodPlaceList;
