import { LatLngExpression } from "leaflet";
import React, { useState } from "react";
import { useEffect } from "react";
import FoodPlace from "../../model/FoodPlace";
import { getValueOrDefault } from "../../utils";
import FilterDropDown from "../FilterDropDown/FilterDropDown";
import FoodPlaceList from "../FoodPlaceList/FoodPlaceList";
import Map from "../Map/Map";
import "./FoodPlaceListWithFilter.scss";

interface IFoodPlaceListWithFilterProps {
    foodPlaces: FoodPlace[];
    mapCenter: LatLngExpression;
    mapZoom: number;
}

const FoodPlaceListWithFilter: React.FC<IFoodPlaceListWithFilterProps> = (
    props
) => {
    const typeOfCuisineOptions = Array.from(
        new Set<string>(
            props.foodPlaces
                .flatMap((v) => v.typeOfCuisine)
                .filter((t) => t !== "")
        )
    );
    const [selectedCuisine, setSelectedCuisine] = useState<string>("");

    const priceOptions = Array.from(
        new Set<string>(
            props.foodPlaces.map((v) => v.price).filter((t) => t !== "")
        )
    );
    const [selectedPrice, setSelectedPrice] = useState<string>("");

    const neighborhoodOptions = Array.from(
        new Set<string>(
            props.foodPlaces
                .map((v) => getValueOrDefault(v.neighborhood))
                .filter((t) => t !== "")
        )
    );
    const [selectedNeighborhood, setSelectedNeighborhood] =
        useState<string>("");

    const [displayedFoodPlaces, setDisplayedFoodPlaces] = useState<FoodPlace[]>(
        props.foodPlaces
    );

    useEffect(() => {
        if (
            selectedCuisine === "all" &&
            selectedNeighborhood === "all" &&
            selectedPrice === "all"
        ) {
            setDisplayedFoodPlaces(props.foodPlaces);
        } else {
            let filteredFoodPlaces = props.foodPlaces;
            if (
                selectedCuisine !== "" &&
                selectedCuisine.toLocaleLowerCase() !== "all"
            ) {
                filteredFoodPlaces = filteredFoodPlaces.filter((t) =>
                    t.typeOfCuisine.includes(selectedCuisine)
                );
            }
            if (
                selectedNeighborhood !== "" &&
                selectedNeighborhood.toLocaleLowerCase() !== "all"
            ) {
                filteredFoodPlaces = filteredFoodPlaces.filter(
                    (t) =>
                        getValueOrDefault(t.neighborhood) ===
                        selectedNeighborhood
                );
            }
            if (
                selectedPrice !== "" &&
                selectedPrice.toLocaleLowerCase() !== "all"
            ) {
                filteredFoodPlaces = filteredFoodPlaces.filter(
                    (t) => t.price === selectedPrice
                );
            }

            setDisplayedFoodPlaces(filteredFoodPlaces);
        }
    }, [
        selectedCuisine,
        selectedNeighborhood,
        selectedPrice,
        props.foodPlaces,
    ]);

    return (
        <section id="food-place-list-with-filter">
            <Map center={props.mapCenter} zoom={props.mapZoom} />
            <div id="food-place-list-with-filter-filters" className="flex-row">
                {typeOfCuisineOptions.length > 0 && (
                    <FilterDropDown
                        filterName="Type of cuisine"
                        options={typeOfCuisineOptions}
                        selectedOption={selectedCuisine}
                        setSelectedOption={setSelectedCuisine}
                    />
                )}
                {priceOptions.length > 0 && (
                    <FilterDropDown
                        filterName="Price"
                        options={priceOptions}
                        selectedOption={selectedPrice}
                        setSelectedOption={setSelectedPrice}
                    />
                )}
                {neighborhoodOptions.length > 0 && (
                    <FilterDropDown
                        filterName="Neighborhood"
                        options={neighborhoodOptions}
                        selectedOption={selectedNeighborhood}
                        setSelectedOption={setSelectedNeighborhood}
                    />
                )}
            </div>

            {displayedFoodPlaces.length > 0 && (
                <FoodPlaceList foodPlaceList={displayedFoodPlaces} />
            )}
            {displayedFoodPlaces.length === 0 && (
                <p>Sorry, nothing matches your selection.</p>
            )}
        </section>
    );
};

export default FoodPlaceListWithFilter;
