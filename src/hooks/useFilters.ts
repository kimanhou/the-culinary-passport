import { useState } from "react";
import {
    getTypeOfCuisineOptions,
    getPriceOptions,
    getNeighborhoodsOptions,
    filterFoodPlaces,
    filteredFavouriteFoodPlaces,
} from "ts/filterUtils";
import FoodPlace from "model/FoodPlace";

interface IFilterState {
    displayedFoodPlaces: FoodPlace[];
    typeOfCuisineOptions: string[];
    selectedCuisines: string[];
    priceOptions: string[];
    selectedPrices: string[];
    neighborhoodOptions: string[];
    selectedNeighborhoods: string[];
    isFavouritesSelected: boolean;
}

export const useFilters = ({
    city,
    foodPlaces,
}: {
    city: string;
    foodPlaces: FoodPlace[];
}) => {
    const computeFilterState = (filterState: IFilterState): IFilterState => {
        const favouriteFoodPlaces = filteredFavouriteFoodPlaces({
            city,
            foodPlaces,
            isFavouritesSelected: filterState.isFavouritesSelected,
        });

        const typeOfCuisineOptions =
            getTypeOfCuisineOptions(favouriteFoodPlaces);
        filterState.selectedCuisines = filterState.selectedCuisines.filter(
            (t) => typeOfCuisineOptions.includes(t)
        );

        const priceOptions = getPriceOptions(favouriteFoodPlaces);
        filterState.selectedPrices = filterState.selectedPrices.filter((t) =>
            priceOptions.includes(t)
        );

        const neighborhoodOptions =
            getNeighborhoodsOptions(favouriteFoodPlaces);
        filterState.selectedNeighborhoods =
            filterState.selectedNeighborhoods.filter((t) =>
                neighborhoodOptions.includes(t)
            );

        const displayedFoodPlaces = filterFoodPlaces({
            city,
            foodPlaces: favouriteFoodPlaces,
            selectedCuisines: filterState.selectedCuisines,
            selectedNeighborhoods: filterState.selectedNeighborhoods,
            selectedPrices: filterState.selectedPrices,
            isFavouritesSelected: filterState.isFavouritesSelected,
        });

        return {
            ...filterState,
            displayedFoodPlaces,
            typeOfCuisineOptions,
            priceOptions,
            neighborhoodOptions,
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
        })
    );

    const toggleTypeOfCuisineOptions = (option: string) => {
        setFilterState((oldFilterState) => {
            const filterState = Object.assign({}, oldFilterState);
            let selected = filterState.selectedCuisines;
            if (selected.includes(option)) {
                selected = selected.filter((t) => t !== option);
            } else {
                selected = [...selected, option];
            }
            filterState.selectedCuisines = selected;
            return computeFilterState(filterState);
        });
    };

    const togglePriceOptions = (option: string) => {
        setFilterState((oldFilterState) => {
            const filterState = Object.assign({}, oldFilterState);
            let selected = filterState.selectedPrices;
            if (selected.includes(option)) {
                selected = selected.filter((t) => t !== option);
            } else {
                selected = [...selected, option];
            }
            filterState.selectedPrices = selected;
            return computeFilterState(filterState);
        });
    };

    const toggleNeighbourhoodOptions = (option: string) => {
        setFilterState((oldFilterState) => {
            const filterState = Object.assign({}, oldFilterState);
            let selected = filterState.selectedNeighborhoods;
            if (selected.includes(option)) {
                selected = selected.filter((t) => t !== option);
            } else {
                selected = [...selected, option];
            }
            filterState.selectedNeighborhoods = selected;

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

    return {
        ...filterState,
        toggleTypeOfCuisineOptions,
        togglePriceOptions,
        toggleNeighbourhoodOptions,
        toggleFavourite,
    };
};
