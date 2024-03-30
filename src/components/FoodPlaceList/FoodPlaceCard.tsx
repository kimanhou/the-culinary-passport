import React, { useState, useRef, useEffect } from "react";
import FoodPlaceModel from "model/FoodPlace";
import FoodPlaceTags from "./FoodPlaceTags";
import FoodPlaceIcons from "./FoodPlaceIcons";
import FoodPlaceImages from "./FoodPlaceImages";
import { CityEnum } from "ts/enum";
import { getFoodPlaceId } from "ts/utils";
import { getLocalStoragePlaceId, isLiked } from "ts/favouriteUtils";
import CloseIcon from "assets/CloseIcon";
import "./FoodPlaceCard.scss";

interface IFoodPlaceCardProps {
    city: CityEnum;
    foodPlace: FoodPlaceModel;
    onLike: (foodPlaceId: number) => void;
}

const FoodPlaceCard: React.FC<IFoodPlaceCardProps> = (props) => {
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const [lineClamp, setLineClamp] = useState<number | undefined>(4);
    const [maxHeight, setMaxHeight] = useState<number | undefined>(300);
    const [isReadMoreVisible, setIsReadMoreVisible] = useState(false);
    const [isReadLessVisible, setIsReadLessVisible] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const isFullScreenClassName = isFullScreen ? "full-screen" : "";
    const foodPlaceId = getFoodPlaceId(props.foodPlace.name);
    const localStoragePlaceId = getLocalStoragePlaceId({
        city: props.city,
        foodPlaceId: props.foodPlace.id,
    });

    const onClickReadButton = () => {
        setLineClamp((t) => {
            if (t) {
                return undefined;
            }
            return 4;
        });

        setMaxHeight((t) => {
            if (t) {
                return undefined;
            }
            return 300;
        });

        setIsReadLessVisible((t) => !t);
        setIsReadMoreVisible((t) => !t);
    };

    const displayCardInFullScreen = () => {
        setIsFullScreen((t) => !t);
        setLineClamp(undefined);
        setMaxHeight(undefined);
    };

    const closeFullScreen = () => {
        setIsFullScreen((t) => !t);
        setLineClamp(4);
        setMaxHeight(300);
    };

    const onClickName = () => {
        if (!isFullScreen) {
            displayCardInFullScreen();
        }
    };

    useEffect(() => {
        if (
            descriptionRef?.current &&
            descriptionRef.current.offsetHeight <
                descriptionRef.current.scrollHeight
        ) {
            setIsReadMoreVisible(true);
        }
    }, []);

    return (
        <div
            className={`food-place-card-wrapper`}
            id={`food-place-${foodPlaceId}`}
        >
            <div className="food-place-card-placeholder"></div>
            <div className={`food-place-card ${isFullScreenClassName}`}>
                {props.foodPlace.images && (
                    <FoodPlaceImages
                        images={props.foodPlace.images}
                        foodPlaceName={props.foodPlace.name}
                        foodPlaceId={foodPlaceId}
                        isLiked={isLiked({ localStoragePlaceId })}
                        onLike={() => props.onLike(props.foodPlace.id)}
                        isFullScreen={isFullScreen}
                    />
                )}

                <div
                    className="food-place-card-content flex-column"
                    style={{ maxHeight }}
                >
                    {isFullScreen && <CloseIcon onClick={closeFullScreen} />}
                    <h5>{props.foodPlace.neighborhood}</h5>
                    <h3 onClick={onClickName}>{props.foodPlace.name}</h3>
                    <FoodPlaceTags
                        tags={[
                            ...props.foodPlace.tags,
                            ...props.foodPlace.typeOfCuisine,
                            props.foodPlace.price,
                        ].filter((t) => t !== "")}
                    />
                    <div className="food-place-card-description-wrapper flex-1">
                        <p
                            style={{ WebkitLineClamp: lineClamp }}
                            ref={descriptionRef}
                        >
                            {props.foodPlace.description}
                        </p>
                        {isReadMoreVisible && !isFullScreen && (
                            <button onClick={onClickReadButton}>
                                Read more
                            </button>
                        )}
                        {isReadLessVisible && !isFullScreen && (
                            <button onClick={onClickReadButton}>
                                Read less
                            </button>
                        )}
                    </div>
                    <FoodPlaceIcons
                        googleMaps={props.foodPlace.googleMaps}
                        instagram={props.foodPlace.instagram}
                        website={props.foodPlace.website}
                    />
                </div>
            </div>
        </div>
    );
};

export default FoodPlaceCard;
