import { useState } from "react";
import {
    getTypeOfCuisineOptions,
    getPriceOptions,
    getNeighborhoodsOptions,
    filterFoodPlaces,
    filteredFavouriteFoodPlaces,
    filterByStayType,
} from "ts/filterUtils";
import FoodPlace from "model/FoodPlace";
import { getLocalStoragePlaceId, setInLocalStorage } from "ts/favouriteUtils";
import { CityEnum, StayEnum } from "ts/enum";
import {
    getStayTypeFromLocalStorage,
    setStayTypeInLocalStorage,
} from "ts/stayTypeUtils";

interface IFilterState {
    displayedFoodPlaces: FoodPlace[];
    typeOfCuisineOptions: string[];
    selectedCuisines: string[];
    priceOptions: string[];
    selectedPrices: string[];
    neighborhoodOptions: string[];
    selectedNeighborhoods: string[];
    isFavouritesSelected: boolean;
    stayType: StayEnum;
}

export const useFilters = ({
    city,
    foodPlaces,
}: {
    city: CityEnum;
    foodPlaces: FoodPlace[];
}) => {
    const computeFilterState = (filterState: IFilterState): IFilterState => {
        const baseFoodPlaces = filterState.isFavouritesSelected
            ? filteredFavouriteFoodPlaces({
                  city,
                  foodPlaces,
                  isFavouritesSelected: filterState.isFavouritesSelected,
              })
            : filterByStayType({
                  foodPlaces,
                  stayType: filterState.stayType,
              });

        const typeOfCuisineOptions = getTypeOfCuisineOptions(baseFoodPlaces);
        const selectedCuisines = filterState.selectedCuisines.filter((t) =>
            typeOfCuisineOptions.includes(t)
        );

        const priceOptions = getPriceOptions(baseFoodPlaces);
        const selectedPrices = filterState.selectedPrices.filter((t) =>
            priceOptions.includes(t)
        );

        const neighborhoodOptions = getNeighborhoodsOptions(baseFoodPlaces);
        const selectedNeighborhoods = filterState.selectedNeighborhoods.filter(
            (t) => neighborhoodOptions.includes(t)
        );

        const displayedFoodPlaces = filterFoodPlaces({
            city,
            foodPlaces: baseFoodPlaces,
            selectedCuisines,
            selectedNeighborhoods,
            selectedPrices,
            isFavouritesSelected: filterState.isFavouritesSelected,
        }).sort(function (a, b) {
            if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
                return -1;
            }
            if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
                return 1;
            }
            return 0;
        });

        return {
            displayedFoodPlaces,
            typeOfCuisineOptions,
            selectedCuisines,
            priceOptions,
            selectedPrices,
            neighborhoodOptions,
            selectedNeighborhoods,
            isFavouritesSelected: filterState.isFavouritesSelected,
            stayType: filterState.stayType,
        };
    };

    const [filterState, setFilterState] = useState<IFilterState>(
        computeFilterState({
            displayedFoodPlaces: foodPlaces,
            typeOfCuisineOptions: getTypeOfCuisineOptions(foodPlaces),
            selectedCuisines: [],
            priceOptions: getPriceOptions(foodPlaces),
            selectedPrices: [],
            neighborhoodOptions: getNeighborhoodsOptions(foodPlaces),
            selectedNeighborhoods: [],
            isFavouritesSelected: false,
            stayType: getStayTypeFromLocalStorage({
                city,
            }),
        })
    );

    const filterSelectedOnOption = (selected: string[], option: string) => {
        if (selected.includes(option)) {
            return selected.filter((t) => t !== option);
        } else {
            return [...selected, option];
        }
    };

    const toggleTypeOfCuisineOptions = (option: string) => {
        setFilterState((oldFilterState) => {
            const filterState = Object.assign({}, oldFilterState);
            filterState.selectedCuisines = filterSelectedOnOption(
                filterState.selectedCuisines,
                option
            );
            return computeFilterState(filterState);
        });
    };

    const togglePriceOptions = (option: string) => {
        setFilterState((oldFilterState) => {
            const filterState = Object.assign({}, oldFilterState);
            filterState.selectedPrices = filterSelectedOnOption(
                filterState.selectedPrices,
                option
            );
            return computeFilterState(filterState);
        });
    };

    const toggleNeighbourhoodOptions = (option: string) => {
        setFilterState((oldFilterState) => {
            const filterState = Object.assign({}, oldFilterState);
            filterState.selectedNeighborhoods = filterSelectedOnOption(
                filterState.selectedNeighborhoods,
                option
            );
            return computeFilterState(filterState);
        });
    };

    const toggleFavourite = () => {
        setFilterState((oldFilterState) => {
            const filterState = Object.assign({}, oldFilterState);
            filterState.isFavouritesSelected =
                !filterState.isFavouritesSelected;
            return computeFilterState(filterState);
        });
    };

    const onLike = (foodPlaceId: number) => {
        setInLocalStorage({
            localStoragePlaceId: getLocalStoragePlaceId({
                city,
                foodPlaceId,
            }),
        });

        setFilterState((oldFilterState) => {
            const filterState = Object.assign({}, oldFilterState);
            return computeFilterState(filterState);
        });
    };

    const onStayTypeChange = () => {
        setFilterState((oldFilterState) => {
            const filterState = Object.assign({}, oldFilterState);
            if (oldFilterState.stayType === StayEnum.TOURIST) {
                filterState.stayType = StayEnum.LOCAL;
                setStayTypeInLocalStorage({
                    city,
                    stayType: StayEnum.LOCAL,
                });
            } else {
                filterState.stayType = StayEnum.TOURIST;
                setStayTypeInLocalStorage({
                    city,
                    stayType: StayEnum.TOURIST,
                });
            }
            return computeFilterState(filterState);
        });
    };

    return {
        ...filterState,
        toggleTypeOfCuisineOptions,
        togglePriceOptions,
        toggleNeighbourhoodOptions,
        toggleFavourite,
        onLike,
        onStayTypeChange,
    };
};
