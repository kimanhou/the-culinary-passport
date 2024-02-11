import React from "react";
import { useState } from "react";
import FoodPlaceImage from "./FoodPlaceImage";
import "./FoodPlaceImages.scss";

interface IFoodPlaceImagesProps {
    images: string[];
    foodPlaceName: string;
    foodPlaceId: string;
}

const FoodPlaceImages: React.FC<IFoodPlaceImagesProps> = (props) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const onClickPrevious = () => {
        setSelectedIndex((selectedIndex - 1) % props.images.length);
        scrollToImage(selectedIndex);
    };

    const onClickNext = () => {
        const newSelectedIndex = (selectedIndex + 1) % props.images.length;
        scrollToImage(newSelectedIndex);
        setSelectedIndex(newSelectedIndex);
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
                        <button
                            className="carousel-button carousel-button-prev"
                            onClick={onClickPrevious}
                        >
                            &#8592;
                        </button>
                        <button
                            className="carousel-button carousel-button-next"
                            onClick={onClickNext}
                        >
                            &#8594;
                        </button>
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
