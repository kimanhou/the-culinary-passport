import React from "react";
import { useState } from "react";
import "./FoodPlaceImages.scss";

interface IFoodPlaceImagesProps {
    images: string[];
    foodPlaceName: string;
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

    const scrollToImage = (selectedIndex: number) => {
        const scrollValue =
            window.innerWidth < 600 ? window.innerWidth - 16 : 300;
        document.querySelector(".food-place-images")?.scrollTo({
            left: selectedIndex * scrollValue,
            behavior: "smooth",
        });
    };

    return (
        <div className="food-place-images-container">
            <div className="food-place-images flex-row">
                {props.images.map((image, i) => (
                    <img
                        src={image}
                        alt={`${i} - ${props.foodPlaceName}`}
                        key={i}
                    />
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
    );
};

export default FoodPlaceImages;
