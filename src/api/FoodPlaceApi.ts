import { arrayHandler } from "../model/deserialization/DeserializationUtils";
import FoodPlace from "../model/FoodPlace";
import { get } from "./JsonApiEndpoint";

// Define API endpoints
const FOOD_PLACE_API_ENDPOINTS = {
    PARIS: "data_paris.json",
    MONTREAL: "data_montreal.json",
};

// Create a reusable function to generate API objects
const createFoodPlaceApi = (endpoint: string) => {
    return {
        get: get(endpoint, arrayHandler(FoodPlace.deserialize)),
    };
};

// Create API objects
export const FoodPlaceApiParis = createFoodPlaceApi(FOOD_PLACE_API_ENDPOINTS.PARIS);
export const FoodPlaceApiMontreal = createFoodPlaceApi(FOOD_PLACE_API_ENDPOINTS.MONTREAL);
