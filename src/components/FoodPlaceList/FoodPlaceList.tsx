import React from "react";
import FoodPlaceModel from "model/FoodPlace";
import FoodPlaceCardFullscreenWrapper from "./FoodPlaceCardFullscreenWrapper";
import { CityEnum } from "ts/enum";
import { getFoodPlaceId } from "ts/utils";
import "./FoodPlaceList.scss";

interface IFoodPlaceListProps {
    foodPlaceList: FoodPlaceModel[];
    city: CityEnum;
    onLike: (foodPlaceId: number) => void;
    foodPlaceId?: string;
}

const FoodPlaceList: React.FC<IFoodPlaceListProps> = (props) => {
    return (
        <ul className="food-place-list flex-row justify-content-center">
            {props.foodPlaceList.map((t) => (
                <li key={t.name}>
                    <FoodPlaceCardFullscreenWrapper
                        city={props.city}
                        foodPlace={t}
                        onLike={props.onLike}
                        isFullScreen={
                            props.foodPlaceId === getFoodPlaceId(t.name)
                        }
                    />
                </li>
            ))}
        </ul>
    );
};

export default FoodPlaceList;
