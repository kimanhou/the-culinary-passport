import React from "react";
import FoodPlaceModel from "model/FoodPlace";
import FoodPlaceCard from "./FoodPlaceCard";
import "./FoodPlaceList.scss";

interface IFoodPlaceListProps {
    foodPlaceList: FoodPlaceModel[];
    city: string;
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
                        <FoodPlaceCard city={props.city} foodPlace={t} />
                    </li>
                ))}
        </ul>
    );
};

export default FoodPlaceList;
