import React, { useState } from "react";
import { useEffect } from "react";
import FoodPlace from "../../model/FoodPlace";
import FilterDropDown from "../FilterDropDown/FilterDropDown";
import FoodPlaceList from "../FoodPlaceList/FoodPlaceList";
import "./FoodPlaceListWithFilter.scss";

interface IFoodPlaceListWithFilterProps {
    foodPlaces: FoodPlace[];
}

const FoodPlaceListWithFilter: React.FC<IFoodPlaceListWithFilterProps> = (
    props
) => {
    const typeOfCuisineOptions = Array.from(
        new Set<string>(props.foodPlaces.flatMap((v) => v.typeOfCuisine))
    );
    const [selectedCuisine, setSelectedCuisine] = useState<string>("");
    const [displayedFoodPlaces, setDisplayedFoodPlaces] = useState<FoodPlace[]>(
        props.foodPlaces
    );

    useEffect(() => {
        if (
            selectedCuisine !== "" &&
            selectedCuisine.toLocaleLowerCase() !== "all"
        ) {
            setDisplayedFoodPlaces(
                props.foodPlaces.filter((t) =>
                    t.typeOfCuisine.includes(selectedCuisine)
                )
            );
        }
    }, [selectedCuisine, props.foodPlaces]);

    return (
        <section id="food-place-list-with-filter">
            {typeOfCuisineOptions.length > 0 && (
                <FilterDropDown
                    options={typeOfCuisineOptions}
                    selectedOption={selectedCuisine}
                    setSelectedOption={setSelectedCuisine}
                />
            )}
            <FoodPlaceList foodPlaceList={displayedFoodPlaces} />
        </section>
    );
};

export default FoodPlaceListWithFilter;
