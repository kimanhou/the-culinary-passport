import React from "react";

interface IFoodPlaceTagsProps {
    tags: string[];
}

const FoodPlaceTags: React.FC<IFoodPlaceTagsProps> = (props) => {
    return (
        <div className="food-place-tags flex-row">
            {props.tags.map((tag, i) => (
                <div className="food-place-tag" key={i}>
                    {tag}
                </div>
            ))}
        </div>
    );
};

export default FoodPlaceTags;
