import React from "react";
import "./FoodPlaceImages.scss";

interface IFoodPlaceImagesProps {
    images: string[];
    foodPlaceName: string;
}

const FoodPlaceImages: React.FC<IFoodPlaceImagesProps> = (props) => {
    return (
        <div className="food-place-images flex-column">
            {props.images.map((image, i) => (
                <img
                    src={image}
                    alt={`${i} - ${props.foodPlaceName}`}
                    key={i}
                />
            ))}
        </div>
    );
};

export default FoodPlaceImages;
