import React from "react";
import FoodPlaceModel from "model/FoodPlace";
import FoodPlace from "./FoodPlace";
import FoodPlaceCard from "./FoodPlaceCard";
import "./FoodPlaceList.scss";

interface IFoodPlaceListProps {
    foodPlaceList: FoodPlaceModel[];
}

const FoodPlaceList: React.FC<IFoodPlaceListProps> = (props) => {
    return (
        <ul className="food-place-list flex-row justify-content-center">
            {props.foodPlaceList
                .sort(function (a, b) {
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }
                    return 0;
                })
                .map((t) => (
                    <li key={t.name}>
                        {/* <FoodPlace foodPlace={t} /> */}
                        <FoodPlaceCard foodPlace={t} />
                    </li>
                ))}
        </ul>
    );
};

export default FoodPlaceList;
