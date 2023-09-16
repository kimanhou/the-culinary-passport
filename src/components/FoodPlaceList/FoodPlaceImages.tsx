import React from "react";

interface IFoodPlaceImagesProps {
    images: string[];
}

const FoodPlaceImages: React.FC<IFoodPlaceImagesProps> = (props) => {
    return (
        <div className="food-place-images flex-column">
            {props.images.map((image, i) => (
                <div className="food-place-image" key={i}>
                    <img src={image}>
                </div>
            ))}
        </div>
    );
};

export default FoodPlaceImages;
