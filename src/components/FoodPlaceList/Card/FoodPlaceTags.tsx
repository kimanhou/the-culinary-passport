import React from "react";
import Tag from "components/common/Tag/Tag";

interface IFoodPlaceTagsProps {
    tags: string[];
}

const FoodPlaceTags: React.FC<IFoodPlaceTagsProps> = (props) => {
    return (
        <ul className="food-place-tags flex-row">
            {props.tags.map((tag, i) => (
                <Tag key={i.toString()} text={tag} />
            ))}
        </ul>
    );
};

export default FoodPlaceTags;
