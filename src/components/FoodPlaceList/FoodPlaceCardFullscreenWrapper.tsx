import React, { FC, useState } from "react";
import FoodPlaceModel from "model/FoodPlace";
import FoodPlaceCard from "./FoodPlaceCard";
import { getFoodPlaceId } from "ts/utils";
import { CityEnum } from "ts/enum";
import "./FoodPlaceCardFullscreenWrapper.scss";

interface IFoodPlaceCardFullscreenWrapperProps {
    city: CityEnum;
    foodPlace: FoodPlaceModel;
    onLike: (foodPlaceId: number) => void;
}

const FoodPlaceCardFullscreenWrapper: FC<
    IFoodPlaceCardFullscreenWrapperProps
> = (props) => {
    const [isFullScreen, setIsFullScreen] = useState(false);

    const foodPlaceId = getFoodPlaceId(props.foodPlace.name);
    const isFullScreenClassName = isFullScreen ? "full-screen" : "";

    return (
        <div
            className={`food-place-card-wrapper`}
            id={`food-place-${foodPlaceId}`}
        >
            <div className="food-place-card-placeholder"></div>
            <FoodPlaceCard
                city={props.city}
                foodPlace={props.foodPlace}
                onLike={props.onLike}
                isFullScreen={isFullScreen}
                setIsFullScreen={setIsFullScreen}
            />
            <div
                className={`full-screen-background ${isFullScreenClassName}`}
            ></div>
        </div>
    );
};

export default FoodPlaceCardFullscreenWrapper;
