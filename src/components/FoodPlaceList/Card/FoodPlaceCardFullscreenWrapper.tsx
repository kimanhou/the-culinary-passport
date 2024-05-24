import React, { FC, useState } from "react";
import FoodPlaceModel from "model/FoodPlace";
import FoodPlaceCard from "./FoodPlaceCard";
import { getFoodPlaceId } from "ts/utils";
import { CityEnum, ToastNotificationEnum } from "ts/enum";
import "./FoodPlaceCardFullscreenWrapper.scss";

interface IFoodPlaceCardFullscreenWrapperProps {
    city: CityEnum;
    foodPlace: FoodPlaceModel;
    onLike: (foodPlaceId: number) => void;
    isFullScreen: boolean;
    showToast: (message: string, type: ToastNotificationEnum) => void;
}

const FoodPlaceCardFullscreenWrapper: FC<
    IFoodPlaceCardFullscreenWrapperProps
> = (props) => {
    const [isFullScreen, setIsFullScreen] = useState(props.isFullScreen);
    const [height, setHeight] = useState("calc(200px + 300px + 2rem)");

    const foodPlaceId = getFoodPlaceId(props.foodPlace.name);
    const isFullScreenClassName = isFullScreen ? "full-screen" : "";

    return (
        <div
            className={`food-place-card-wrapper`}
            id={`food-place-${foodPlaceId}`}
        >
            <div
                className="food-place-card-placeholder"
                style={{ height }}
            ></div>
            <FoodPlaceCard
                city={props.city}
                foodPlace={props.foodPlace}
                onLike={props.onLike}
                isFullScreen={isFullScreen}
                setIsFullScreen={setIsFullScreen}
                setHeight={setHeight}
                showToast={props.showToast}
            />
            <div
                className={`full-screen-background ${isFullScreenClassName}`}
            ></div>
        </div>
    );
};

export default FoodPlaceCardFullscreenWrapper;
