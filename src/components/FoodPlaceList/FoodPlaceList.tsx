import React from "react";
import FoodPlaceModel from "model/FoodPlace";
import FoodPlaceCardFullscreenWrapper from "./FoodPlaceCardFullscreenWrapper";
import { CityEnum } from "ts/enum";
import "./FoodPlaceList.scss";

interface IFoodPlaceListProps {
    foodPlaceList: FoodPlaceModel[];
    city: CityEnum;
    onLike: (foodPlaceId: number) => void;
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
                        <FoodPlaceCardFullscreenWrapper
                            city={props.city}
                            foodPlace={t}
                            onLike={props.onLike}
                        />
                    </li>
                ))}
        </ul>
    );
};

export default FoodPlaceList;
