import React from "react";

interface IFoodPlaceTagsProps {
    tags: string[];
}

const FoodPlaceTags: React.FC<IFoodPlaceTagsProps> = (props) => {
    return (
        <ul className="food-place-tags flex-row">
            {props.tags.map((tag, i) => (
                <li className="food-place-tag" key={i}>
                    {tag}
                </li>
            ))}
        </ul>
    );
};

export default FoodPlaceTags;
