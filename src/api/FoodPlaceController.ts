import FoodPlaceApi from "./FoodPlaceApi";

class FoodPlaceController {
    get = () => {
        return FoodPlaceApi.get();
    };
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new FoodPlaceController();
