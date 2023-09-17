import { FoodPlaceApiParis, FoodPlaceApiMontreal } from "./FoodPlaceApi";


class FoodPlaceController {
    constructor(private city: string) { }

    get = () => {
        if (this.city === "Paris") {
            return FoodPlaceApiParis.get();
        } else if (this.city === "Montreal") {
            return FoodPlaceApiMontreal.get();
        } else {
            throw new Error(`Unsupported city: ${this.city}`);
        }
    };
}

// eslint-disable-next-line import/no-anonymous-default-export
export const FoodPlaceControllerParis = new FoodPlaceController("Paris");
export const FoodPlaceControllerMontreal = new FoodPlaceController("Montreal");

