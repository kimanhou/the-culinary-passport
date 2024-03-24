import FoodPlace from "model/FoodPlace";
import { getLocalStoragePlaceId, isLiked } from "ts/favouriteUtils";
import { getValueOrDefault } from "ts/utils";
import { CityEnum, StayEnum } from "ts/enum";

export const getNeighborhoodsOptions = (foodPlaces: FoodPlace[]) => {
    return Array.from(
        new Set<string>(
            foodPlaces
                .map((v) => getValueOrDefault(v.neighborhood))
                .filter((t) => t !== "")
        )
    );
};

export const getPriceOptions = (foodPlaces: FoodPlace[]) => {
    return Array.from(
        new Set<string>(foodPlaces.map((v) => v.price).filter((t) => t !== ""))
    );
};

export const getTypeOfCuisineOptions = (foodPlaces: FoodPlace[]) => {
    return Array.from(
        new Set<string>(
            foodPlaces.flatMap((v) => v.typeOfCuisine).filter((t) => t !== "")
        )
    );
};

export const getFilterOptions = (foodPlaces: FoodPlace[]) => {
    const neighborhoodsOptions = getNeighborhoodsOptions(foodPlaces);
    const pricesOptions = getPriceOptions(foodPlaces);
    const cuisinesOptions = getTypeOfCuisineOptions(foodPlaces);

    return { neighborhoodsOptions, pricesOptions, cuisinesOptions };
};

export const filterByStayType = ({
    foodPlaces,
    stayType,
}: {
    foodPlaces: FoodPlace[];
    stayType: keyof typeof StayEnum;
}) => {
    return foodPlaces.filter(
        (t) => t.stayType === undefined || t.stayType === stayType
    );
};

export const filteredFavouriteFoodPlaces = ({
    city,
    foodPlaces,
    isFavouritesSelected,
}: {
    city: CityEnum;
    foodPlaces: FoodPlace[];
    isFavouritesSelected: boolean;
}) => {
    if (!isFavouritesSelected) return foodPlaces;

    return foodPlaces.filter((t) =>
        isLiked({
            localStoragePlaceId: getLocalStoragePlaceId({
                city,
                foodPlaceId: t.id,
            }),
        })
    );
};

export const filterFoodPlaces = ({
    city,
    foodPlaces,
    selectedNeighborhoods,
    selectedPrices,
    selectedCuisines,
    isFavouritesSelected,
}: {
    city: CityEnum;
    foodPlaces: FoodPlace[];
    selectedNeighborhoods: string[];
    selectedPrices: string[];
    selectedCuisines: string[];
    isFavouritesSelected: boolean;
}) => {
    if (
        selectedCuisines.length === 0 &&
        selectedNeighborhoods.length === 0 &&
        selectedPrices.length === 0 &&
        !isFavouritesSelected
    ) {
        return foodPlaces;
    } else {
        let filteredFoodPlaces = foodPlaces;
        if (selectedCuisines.length > 0) {
            filteredFoodPlaces = filteredFoodPlaces.filter(
                (t) =>
                    selectedCuisines.filter((x) => t.typeOfCuisine.includes(x))
                        .length > 0
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
        if (isFavouritesSelected) {
            filteredFoodPlaces = filteredFoodPlaces.filter((t) =>
                isLiked({
                    localStoragePlaceId: getLocalStoragePlaceId({
                        city,
                        foodPlaceId: t.id,
                    }),
                })
            );
        }

        return filteredFoodPlaces;
    }
};

export const hasStayType = (foodPlaces: FoodPlace[]): boolean => {
    return foodPlaces.some((t) => t.stayType != null);
};
