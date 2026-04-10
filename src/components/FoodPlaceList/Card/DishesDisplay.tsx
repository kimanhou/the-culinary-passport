import React from "react";
import Tag from "components/common/Tag/Tag";
import "./DishesDisplay.scss";

interface IDishesDisplayProps {
    dishes: string[];
    maxItems: number;
}

const DishesDisplay: React.FC<IDishesDisplayProps> = ({ dishes, maxItems }) => {
    if (dishes.length === 0) {
        return null;
    }

    const visibleDishes = dishes.slice(0, maxItems);

    return (
        <ul className="dishes-display flex-row">
            {visibleDishes.map((dish, i) => (
                <Tag key={i.toString()} text={dish} />
            ))}
        </ul>
    );
};

export default DishesDisplay;
