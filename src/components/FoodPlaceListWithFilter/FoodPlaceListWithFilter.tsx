import React, { useState, useEffect } from "react";
import { LatLngExpression } from "leaflet";
import FoodPlace from "model/FoodPlace";
import Filter from "components/Filter/Filter";
import FoodPlaceList from "components/FoodPlaceList/FoodPlaceList";
import ramen from "assets/ramen.png";
import coin from "assets/coin.png";
import map from "assets/map.png";
import { getValueOrDefault } from "utils";
import "./FoodPlaceListWithFilter.scss";

interface IFoodPlaceListWithFilterProps {
    foodPlaces: FoodPlace[];
    mapCenter: LatLngExpression;
    mapZoom: number;
    city: string;
}

const FoodPlaceListWithFilter: React.FC<IFoodPlaceListWithFilterProps> = (
    props
) => {
    const touristFoodPlaces = props.foodPlaces.filter((t) => !t.isLocal);
    const [displayedFoodPlaces, setDisplayedFoodPlaces] =
        useState<FoodPlace[]>(touristFoodPlaces);

    const typeOfCuisineOptions = Array.from(
        new Set<string>(
            touristFoodPlaces
                .flatMap((v) => v.typeOfCuisine)
                .filter((t) => t !== "")
        )
    );
    const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);

    const priceOptions = Array.from(
        new Set<string>(
            touristFoodPlaces.map((v) => v.price).filter((t) => t !== "")
        )
    );
    const [selectedPrices, setSelectedPrices] = useState<string[]>([]);

    const neighborhoodOptions = Array.from(
        new Set<string>(
            touristFoodPlaces
                .map((v) => getValueOrDefault(v.neighborhood))
                .filter((t) => t !== "")
        )
    );
    const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<
        string[]
    >([]);

    useEffect(() => {
        if (
            selectedCuisines.length === 0 &&
            selectedNeighborhoods.length === 0 &&
            selectedPrices.length === 0
        ) {
            setDisplayedFoodPlaces(touristFoodPlaces);
        } else {
            let filteredFoodPlaces = touristFoodPlaces;
            if (selectedCuisines.length > 0) {
                filteredFoodPlaces = filteredFoodPlaces.filter(
                    (t) =>
                        selectedCuisines.filter((x) =>
                            t.typeOfCuisine.includes(x)
                        ).length > 0
                );
            }
            if (selectedNeighborhoods.length > 0) {
                filteredFoodPlaces = filteredFoodPlaces.filter((t) =>
                    selectedNeighborhoods.includes(
                        getValueOrDefault(t.neighborhood)
                    )
                );
            }
            if (selectedPrices.length > 0) {
                filteredFoodPlaces = filteredFoodPlaces.filter((t) =>
                    selectedPrices.includes(t.price)
                );
            }

            setDisplayedFoodPlaces(filteredFoodPlaces);
        }
    }, [
        selectedCuisines,
        selectedNeighborhoods,
        selectedPrices,
        props.foodPlaces,
    ]);

    return (
        <section id="food-place-list-with-filter">
            <div id="food-place-list-with-filter-filters" className="flex-row">
                {typeOfCuisineOptions.length > 0 && (
                    <Filter
                        filterName="Cuisine"
                        icon={<img src={ramen} alt={"Cuisine filter icon"} />}
                        options={typeOfCuisineOptions}
                        selectedOptions={selectedCuisines}
                        setSelectedOptions={setSelectedCuisines}
                    />
                )}
                {priceOptions.length > 0 && (
                    <Filter
                        filterName="Price"
                        icon={<img src={coin} alt={"Price filter icon"} />}
                        options={priceOptions}
                        selectedOptions={selectedPrices}
                        setSelectedOptions={setSelectedPrices}
                    />
                )}
                {neighborhoodOptions.length > 0 && (
                    <Filter
                        filterName="Neighborhood"
                        icon={
                            <img src={map} alt={"Neighborhood filter icon"} />
                        }
                        options={neighborhoodOptions}
                        selectedOptions={selectedNeighborhoods}
                        setSelectedOptions={setSelectedNeighborhoods}
                    />
                )}
            </div>

            {displayedFoodPlaces.length > 0 && (
                <FoodPlaceList
                    city={props.city}
                    foodPlaceList={displayedFoodPlaces}
                />
            )}
            {displayedFoodPlaces.length === 0 && (
                <p>Sorry, nothing matches your selection.</p>
            )}
        </section>
    );
};

export default FoodPlaceListWithFilter;
