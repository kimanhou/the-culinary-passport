import React, { useState, useEffect } from "react";
import { LatLngExpression } from "leaflet";
import FoodPlace from "model/FoodPlace";
import Filter from "components/Filter/Filter";
import FavouritesFilter from "components/Filter/FavouritesFilter";
import FoodPlaceList from "components/FoodPlaceList/FoodPlaceList";
import ramen from "assets/ramen.png";
import coin from "assets/coin.png";
import map from "assets/map.png";
import { hasFavourites as hasFavouritesFunc } from "ts/favouriteUtils";
import {
    filterFoodPlaces,
    getFilterOptions,
    getNeighborhoodsOptions,
    getPriceOptions,
    getTypeOfCuisineOptions,
} from "./filterUtils";
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

    const [typeOfCuisineOptions, setTypeOfCuisineOptions] = useState<string[]>(
        getTypeOfCuisineOptions(touristFoodPlaces)
    );
    const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);

    const [priceOptions, setPriceOptions] = useState<string[]>(
        getPriceOptions(touristFoodPlaces)
    );
    const [selectedPrices, setSelectedPrices] = useState<string[]>([]);

    const [neighborhoodOptions, setNeighborhoodOptions] = useState<string[]>(
        getNeighborhoodsOptions(touristFoodPlaces)
    );
    const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<
        string[]
    >([]);

    const hasFavourites = hasFavouritesFunc(props.city);
    const [isFavouritesSelected, setIsFavouritesSelected] = useState(false);

    const onFavouritesFilterChange = () => {
        setIsFavouritesSelected((t) => !t);
        const filtered = filterFoodPlaces({
            city: props.city,
            foodPlaces: touristFoodPlaces,
            selectedNeighborhoods,
            selectedPrices,
            selectedCuisines,
            isFavouritesSelected: !isFavouritesSelected,
        });

        const { neighborhoodsOptions, pricesOptions, cuisinesOptions } =
            getFilterOptions(filtered);
        setPriceOptions(pricesOptions);
        setTypeOfCuisineOptions(cuisinesOptions);
        setNeighborhoodOptions(neighborhoodsOptions);
    };

    useEffect(() => {
        const filtered = filterFoodPlaces({
            city: props.city,
            foodPlaces: touristFoodPlaces,
            selectedNeighborhoods,
            selectedPrices,
            selectedCuisines,
            isFavouritesSelected,
        });

        setDisplayedFoodPlaces(filtered);
    }, [
        selectedCuisines,
        selectedNeighborhoods,
        selectedPrices,
        isFavouritesSelected,
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
                {hasFavourites && (
                    <FavouritesFilter
                        isSelected={isFavouritesSelected}
                        onChange={onFavouritesFilterChange}
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
