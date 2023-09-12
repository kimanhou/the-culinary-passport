import React from "react";
import FoodPlaceModel from "../../model/FoodPlace";
import FoodPlace from "./FoodPlace";

interface IFoodPlaceListProps {
    foodPlaceList: FoodPlaceModel[];
}

const FoodPlaceList: React.FC<IFoodPlaceListProps> = (props) => {
    return (
        <ul>
            {props.foodPlaceList.map((t) => (
                <li key={t.name}>
                    <FoodPlace foodPlace={t} />
                </li>
            ))}
        </ul>
    );
};

export default FoodPlaceList;
