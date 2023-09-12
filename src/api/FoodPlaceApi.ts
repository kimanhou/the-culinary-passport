import { arrayHandler } from "../model/deserialization/DeserializationUtils";
import FoodPlace from "../model/FoodPlace";
import { get } from "./JsonApiEndpoint";

export const FOOD_PLACE_API_ENDPOINT = "data.json";

const FoodPlaceApi = {
    get: get(FOOD_PLACE_API_ENDPOINT, arrayHandler(FoodPlace.deserialize)),
};
export default FoodPlaceApi;
