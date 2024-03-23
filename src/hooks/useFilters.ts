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
        const selectedCuisines = filterState.selectedCuisines.filter((t) =>
            typeOfCuisineOptions.includes(t)
        );

        const priceOptions = getPriceOptions(favouriteFoodPlaces);
        const selectedPrices = filterState.selectedPrices.filter((t) =>
            priceOptions.includes(t)
        );

        const neighborhoodOptions =
            getNeighborhoodsOptions(favouriteFoodPlaces);
        const selectedNeighborhoods = filterState.selectedNeighborhoods.filter(
            (t) => neighborhoodOptions.includes(t)
        );

        const displayedFoodPlaces = filterFoodPlaces({
            city,
            foodPlaces: favouriteFoodPlaces,
            selectedCuisines,
            selectedNeighborhoods,
            selectedPrices,
            isFavouritesSelected: filterState.isFavouritesSelected,
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

    return {
        ...filterState,
        toggleTypeOfCuisineOptions,
        togglePriceOptions,
        toggleNeighbourhoodOptions,
        toggleFavourite,
    };
};
