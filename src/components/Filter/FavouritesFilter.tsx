import React, { Dispatch, FC, SetStateAction } from "react";
import heart from "assets/heart.png";

interface IFavouritesFilterProps {
    isSelected: boolean;
    setIsSelected: Dispatch<SetStateAction<boolean>>;
}

const FavouritesFilter: FC<IFavouritesFilterProps> = (props) => {
    return (
        <div className={`filter`}>
            <div
                className="filter-header flex-column align-items-center"
                onClick={() => props.setIsSelected((t) => !t)}
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
