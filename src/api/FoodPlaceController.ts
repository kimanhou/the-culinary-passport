import { FoodPlaceApiParis, FoodPlaceApiMontreal } from "./FoodPlaceApi";

export class FoodPlaceController {
    constructor(private city: string) {}

    get = () => {
        switch (this.city.toLocaleLowerCase()) {
            case "paris":
                return FoodPlaceApiParis.get();
            case "montreal":
                return FoodPlaceApiMontreal.get();
            default:
                throw new Error(`Unsupported city: ${this.city}`);
        }
    };
}

// eslint-disable-next-line import/no-anonymous-default-export
// export const FoodPlaceController = new FoodPlaceController("Paris");
// export const FoodPlaceControllerMontreal = new FoodPlaceController("Montreal");
