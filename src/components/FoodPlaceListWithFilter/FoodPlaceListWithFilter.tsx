import React from "react";
import { useFilters } from "hooks/useFilters";
import { hasFavourites as hasFavouritesFunc } from "ts/favouriteUtils";
import { LatLngExpression } from "leaflet";
import FoodPlace from "model/FoodPlace";
import Filter from "components/Filter/Filter";
import FavouritesFilter from "components/Filter/FavouritesFilter";
import FoodPlaceList from "components/FoodPlaceList/FoodPlaceList";
import ramen from "assets/ramen.png";
import coin from "assets/coin.png";
import map from "assets/map.png";
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

    const {
        displayedFoodPlaces,
        typeOfCuisineOptions,
        selectedCuisines,
        priceOptions,
        selectedPrices,
        neighborhoodOptions,
        selectedNeighborhoods,
        isFavouritesSelected,
        toggleTypeOfCuisineOptions,
        togglePriceOptions,
        toggleNeighbourhoodOptions,
        toggleFavourite,
    } = useFilters({ city: props.city, foodPlaces: touristFoodPlaces });

    const hasFavourites = hasFavouritesFunc(props.city);

    return (
        <section id="food-place-list-with-filter">
            <div id="food-place-list-with-filter-filters" className="flex-row">
                {typeOfCuisineOptions.length > 0 && (
                    <Filter
                        filterName="Cuisine"
                        icon={<img src={ramen} alt={"Cuisine filter icon"} />}
                        options={typeOfCuisineOptions}
                        selectedOptions={selectedCuisines}
                        setSelectedOptions={toggleTypeOfCuisineOptions}
                    />
                )}
                {priceOptions.length > 0 && (
                    <Filter
                        filterName="Price"
                        icon={<img src={coin} alt={"Price filter icon"} />}
                        options={priceOptions}
                        selectedOptions={selectedPrices}
                        setSelectedOptions={togglePriceOptions}
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
                        setSelectedOptions={toggleNeighbourhoodOptions}
                    />
                )}
                {hasFavourites && (
                    <FavouritesFilter
                        isSelected={isFavouritesSelected}
                        onChange={toggleFavourite}
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
