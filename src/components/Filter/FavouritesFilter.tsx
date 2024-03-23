import React, { FC } from "react";
import heart from "assets/heart.png";

interface IFavouritesFilterProps {
    isSelected: boolean;
    onChange: () => void;
}

const FavouritesFilter: FC<IFavouritesFilterProps> = (props) => {
    return (
        <div className={`filter`}>
            <div
                className="filter-header flex-column align-items-center"
                onClick={() => props.onChange()}
            >
                <img src={heart} alt={"Favourites filter icon"} />
                <label className={`filter-label`}>My favorites</label>
            </div>

            <div
                className={`filter-underline ${
                    props.isSelected ? "visible" : ""
                }`}
            />
        </div>
    );
};

export default FavouritesFilter;
