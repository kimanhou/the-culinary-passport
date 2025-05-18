import City from "@/model/City";
import { createFoodPlaceApi } from "@/api/FoodPlaceApi";

export class FoodPlaceController {
    constructor(private city: City) {}

    get = () => {
        return createFoodPlaceApi(this.city.dataFile).get();
    };
}
