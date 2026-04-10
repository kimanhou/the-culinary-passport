import React, { useState } from "react";
import FoodPlaceImage from "./FoodPlaceImage";
import Heart from "components/common/Heart/Heart";
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
    isLiked: boolean;
    onLike: () => void;
    isFullScreen: boolean;
}

const FoodPlaceImages: React.FC<IFoodPlaceImagesProps> = (props) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const imagesContainerRef = React.useRef<HTMLDivElement>(null);

    const canPrevious = props.images.length > 1 && selectedIndex > 0;
    const canNext =
        props.images.length > 1 && selectedIndex < props.images.length - 1;

    const scrollToImage = (index: number) => {
        const container = imagesContainerRef.current;
        if (!container) return;
        const scrollValue = container.clientWidth;
        container.scrollTo({
            left: index * scrollValue,
            behavior: "smooth",
        });
    };

    const onClickPrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const newIndex = selectedIndex - 1;
        setSelectedIndex(newIndex);
        scrollToImage(newIndex);
    };

    const onClickNext = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const newIndex = selectedIndex + 1;
        setSelectedIndex(newIndex);
        scrollToImage(newIndex);
    };

    const isFullScreenClassName = props.isFullScreen ? "full-screen" : "";

    return (
        <div
            className={`food-place-images-wrapper flex-column ${isFullScreenClassName}`}
        >
            <div className="food-place-images-container">
                <div ref={imagesContainerRef} className={`food-place-images flex-row`}>
                    <Heart
                        isFilled={props.isLiked}
                        setInLocalStorage={props.onLike}
                    />
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
