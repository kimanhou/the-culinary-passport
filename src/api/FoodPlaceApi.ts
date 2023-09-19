import { arrayHandler } from "../model/deserialization/DeserializationUtils";
import FoodPlace from "../model/FoodPlace";
import { get } from "./JsonApiEndpoint";

// Create a reusable function to generate API objects
export const createFoodPlaceApi = (endpoint: string) => {
    return {
        get: get(endpoint, arrayHandler(FoodPlace.deserialize)),
    };
};
