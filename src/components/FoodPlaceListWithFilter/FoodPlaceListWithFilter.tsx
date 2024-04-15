import React, { useEffect } from "react";
import { scrollTo } from "ts/utils";
import { useFilters } from "hooks/useFilters";
import { hasFavourites as hasFavouritesFunc } from "ts/favouriteUtils";
import { hasStayType as hasStayTypeFunc } from "ts/filterUtils";
import { CityEnum, ToastNotificationEnum } from "ts/enum";
import { LatLngExpression } from "leaflet";
import FoodPlace from "model/FoodPlace";
import Filter from "components/Filter/Filter";
import FavouritesFilter from "components/Filter/FavouritesFilter";
import FoodPlaceList from "components/FoodPlaceList/FoodPlaceList";
import TouristToggle from "components/Filter/TouristToggle";
import ramen from "assets/ramen.png";
import coin from "assets/coin.png";
import map from "assets/map.png";
import "./FoodPlaceListWithFilter.scss";

interface IFoodPlaceListWithFilterProps {
    foodPlaces: FoodPlace[];
    mapCenter: LatLngExpression;
    mapZoom: number;
    city: CityEnum;
    showToast: (message: string, type: ToastNotificationEnum) => void;
    foodPlaceId?: string;
}

const FoodPlaceListWithFilter: React.FC<IFoodPlaceListWithFilterProps> = (
    props
) => {
    const {
        displayedFoodPlaces,
        typeOfCuisineOptions,
        selectedCuisines,
        priceOptions,
        selectedPrices,
        neighborhoodOptions,
        selectedNeighborhoods,
        isFavouritesSelected,
        stayType,
        toggleTypeOfCuisineOptions,
        togglePriceOptions,
        toggleNeighbourhoodOptions,
        toggleFavourite,
        onLike,
        onStayTypeChange,
    } = useFilters({ city: props.city, foodPlaces: props.foodPlaces });

    const hasFavourites = hasFavouritesFunc(props.city);
    const hasStayType = hasStayTypeFunc(props.foodPlaces);

    useEffect(() => {
        if (props.foodPlaceId) {
            scrollTo({
                elementId: `food-place-${props.foodPlaceId}`,
            });
        }
    }, [props.foodPlaceId]);

    return (
        <section id="food-place-list-with-filter">
            {hasStayType && (
                <TouristToggle
                    stayType={stayType}
                    onStayTypeChange={onStayTypeChange}
                    disabled={isFavouritesSelected}
                />
            )}
            <div id="food-place-list-with-filter-filters" className="flex-row">
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
                {priceOptions.length > 0 && (
                    <Filter
                        filterName="Price"
                        icon={<img src={coin} alt={"Price filter icon"} />}
                        options={priceOptions}
                        selectedOptions={selectedPrices}
                        setSelectedOptions={togglePriceOptions}
                    />
                )}
                {typeOfCuisineOptions.length > 0 && (
                    <Filter
                        filterName="Cuisine"
                        icon={<img src={ramen} alt={"Cuisine filter icon"} />}
                        options={typeOfCuisineOptions}
                        selectedOptions={selectedCuisines}
                        setSelectedOptions={toggleTypeOfCuisineOptions}
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
                    onLike={onLike}
                    foodPlaceId={props.foodPlaceId}
                    showToast={props.showToast}
                />
            )}
            {displayedFoodPlaces.length === 0 && (
                <p>Sorry, nothing matches your selection.</p>
            )}
        </section>
    );
};

export default FoodPlaceListWithFilter;
