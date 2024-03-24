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
    stayType: keyof typeof StayEnum;
}

export const useFilters = ({
    city,
    foodPlaces,
}: {
    city: CityEnum;
    foodPlaces: FoodPlace[];
}) => {
    const computeFilterState = (filterState: IFilterState): IFilterState => {
        const baseFoodPlaces = filterByStayType({
            foodPlaces,
            stayType: filterState.stayType,
        });

        const favouriteFoodPlaces = filteredFavouriteFoodPlaces({
            city,
            foodPlaces: baseFoodPlaces,
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
            }) as keyof typeof StayEnum,
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
                filterState.stayType = StayEnum.LOCAL as keyof typeof StayEnum;
                setStayTypeInLocalStorage({
                    city,
                    stayType: StayEnum.LOCAL as keyof typeof StayEnum,
                });
            } else {
                filterState.stayType =
                    StayEnum.TOURIST as keyof typeof StayEnum;
                setStayTypeInLocalStorage({
                    city,
                    stayType: StayEnum.TOURIST as keyof typeof StayEnum,
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
