import React from "react";
import { useState } from "react";
import FoodPlaceImage from "./FoodPlaceImage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronRight,
    faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import "./FoodPlaceImages.scss";

interface IFoodPlaceImagesProps {
    images: string[];
    foodPlaceName: string;
    foodPlaceId: string;
}

const FoodPlaceImages: React.FC<IFoodPlaceImagesProps> = (props) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const canPrevious = props.images.length > 1 && selectedIndex > 0;
    const canNext =
        props.images.length > 1 && selectedIndex < props.images.length - 1;

    const onClickPrevious = () => {
        setSelectedIndex((t) => t - 1);
        scrollToImage(selectedIndex - 1);
    };

    const onClickNext = () => {
        setSelectedIndex((t) => t + 1);
        scrollToImage(selectedIndex + 1);
    };

    const imagesId = `food-place-images-${props.foodPlaceId}`;

    const scrollToImage = (selectedIndex: number) => {
        const scrollValue =
            window.innerWidth < 600 ? window.innerWidth - 16 : 300;
        document.querySelector(`#${imagesId}`)?.scrollTo({
            left: selectedIndex * scrollValue,
            behavior: "smooth",
        });
    };

    return (
        <div className="food-place-images-wrapper flex-column">
            <div className="food-place-images-container">
                <div id={imagesId} className={`food-place-images flex-row`}>
                    {props.images.map((image, i) => (
                        <div className="food-place-image-container" key={i}>
                            <FoodPlaceImage
                                src={image}
                                index={i}
                                foodPlaceName={props.foodPlaceName}
                                setSelectedIndex={setSelectedIndex}
                            />
                        </div>
                    ))}
                </div>
                {props.images.length > 1 && (
                    <>
                        {canPrevious && (
                            <button
                                className="carousel-button carousel-button-prev flex-row align-items-center justify-content-center"
                                onClick={onClickPrevious}
                            >
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>
                        )}
                        {canNext && (
                            <button
                                className="carousel-button carousel-button-next flex-row align-items-center justify-content-center"
                                onClick={onClickNext}
                            >
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        )}
                    </>
                )}
            </div>
            {props.images.length > 1 && (
                <div className="carousel-dots">
                    {props.images.map((t, i) => (
                        <span
                            className={`dot ${
                                selectedIndex === i ? "selected" : ""
                            }`}
                            key={i}
                        ></span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FoodPlaceImages;
