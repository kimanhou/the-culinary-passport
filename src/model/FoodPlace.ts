import { FieldType } from "./deserialization/FieldType";
import JsonDeserializationHelper from "./deserialization/JsonDeserializationHelper";

export enum Neighborhood {
    ANY = "Any",
    EXARCHIA = "Exarchia",
    KOLONAKI = "Kolonaki",
    HISTORICAL = "Historical center",
    KERAMIKOS = "Keramikos",
    PANGRATI = "Pangrati",
}

export enum FoodPlaceTag {
    CHEAP = "Cheap",
    LOCAL = "Local",
    FAST = "Fast",
}

export default class FoodPlace {
    name: string;
    location: string;
    tags: FoodPlaceTag[];
    description: string;
    price: string;
    neighborhood: Neighborhood;
    link?: string;

    constructor(
        name: string,
        location: string,
        tags: FoodPlaceTag[],
        description: string,
        price: string,
        neighborhood: Neighborhood,
        link?: string
    ) {
        this.name = name;
        this.location = location;
        this.tags = tags;
        this.description = description;
        this.price = price;
        this.neighborhood = neighborhood;
        this.link = link;
    }

    static deserialize = (data: any) => {
        const name = JsonDeserializationHelper.assertField(
            data,
            "name",
            FieldType.STRING
        );
        const location = JsonDeserializationHelper.assertFieldOrDefault(
            data,
            "location",
            FieldType.STRING,
            ""
        );
        const tags = JsonDeserializationHelper.assertArray(
            data,
            "tags",
            (t) => t as FoodPlaceTag
        );
        const description = JsonDeserializationHelper.assertFieldOrDefault(
            data,
            "description",
            FieldType.STRING,
            ""
        );
        const price = JsonDeserializationHelper.assertFieldOrDefault(
            data,
            "price",
            FieldType.STRING,
            ""
        );
        const neighborhood: Neighborhood =
            JsonDeserializationHelper.assertFieldOrDefault(
                data,
                "neighborhood",
                FieldType.STRING,
                ""
            ) as Neighborhood;
        const link = JsonDeserializationHelper.assertFieldOrDefault(
            data,
            "link",
            FieldType.STRING,
            ""
        );
        return new FoodPlace(
            name,
            location,
            tags,
            description,
            price,
            neighborhood,
            link
        );
    };

    static getAllFoodPlaces = () => {
        return [
            FoodPlace.ACHILLEAS,
            FoodPlace.FALAFELLAS,
            FoodPlace.KOSTAS,
            FoodPlace.MELT,
            FoodPlace.GRANELLO,
            FoodPlace.KAMPETHON,
            FoodPlace.NAKAMA,
            FoodPlace.CUPPOLA,
            FoodPlace.SKLAVENITIS,
        ];
    };

    static getAllFoodPlaceNeighborhoods = () => {
        return [
            Neighborhood.ANY,
            Neighborhood.HISTORICAL,
            Neighborhood.KOLONAKI,
            Neighborhood.EXARCHIA,
            Neighborhood.KERAMIKOS,
            Neighborhood.PANGRATI,
        ];
    };

    static getAllFoodPlaceTags = () => {
        return [FoodPlaceTag.CHEAP, FoodPlaceTag.FAST, FoodPlaceTag.LOCAL];
    };

    static ACHILLEAS = new FoodPlace(
        "Achilleas",
        "https://goo.gl/maps/DFPVfxtgXpRHAEhw7",
        [FoodPlaceTag.CHEAP, FoodPlaceTag.LOCAL, FoodPlaceTag.FAST],
        "Cheap, fast, good. Come here for the souvlaki store and plenty of other stuff.",
        "2.50€ / sandwich",
        Neighborhood.EXARCHIA
    );
    static FALAFELLAS = new FoodPlace(
        "Falafellas",
        "https://goo.gl/maps/DSXRYF9moQ4bZbZD8",
        [FoodPlaceTag.CHEAP, FoodPlaceTag.FAST],
        "Good falafel or meat balls in pita bread.",
        "2.80€ for a falafel sandwich",
        Neighborhood.HISTORICAL
    );
    static KOSTAS = new FoodPlace(
        "Kostas",
        "https://goo.gl/maps/aAbhn3y4fLAZyMkF8",
        [FoodPlaceTag.CHEAP, FoodPlaceTag.FAST],
        "Decent souvlaki gyros in historic center.",
        "3€ / sandwich",
        Neighborhood.HISTORICAL
    );
    static MELT = new FoodPlace(
        "Melt",
        "https://goo.gl/maps/aF1ba7WdkYjWkb8a6",
        [FoodPlaceTag.FAST],
        "Slightly overpriced but good, especially the Sicilian pistacchio flavor.",
        "2.20€ / one flavor",
        Neighborhood.HISTORICAL
    );
    static GRANELLO = new FoodPlace(
        "Granello",
        "https://g.page/granellopizza?share",
        [FoodPlaceTag.FAST],
        "Very good Neapoletan-style pizza, better to take away or delivery.",
        "<10€ / pizza",
        Neighborhood.HISTORICAL,
        "https://granellopizza.gr/"
    );
    static KAMPETHON = new FoodPlace(
        "Kampethon",
        "https://goo.gl/maps/W573AMCxBP17RfB47",
        [FoodPlaceTag.LOCAL],
        "Local bar with dining options, tucked away in an empty area, good vibes.",
        "7.50€ for 200mL of pure Ouzo",
        Neighborhood.KERAMIKOS
    );
    static NAKAMA = new FoodPlace(
        "Nakama",
        "https://goo.gl/maps/Vy8K9SHCiHWFfaMAA",
        [FoodPlaceTag.LOCAL],
        "Casual sushi bar in Kolonaki.",
        "About 15€ / person",
        Neighborhood.KOLONAKI,
        "https://www.nakama.gr/"
    );
    static SKLAVENITIS = new FoodPlace(
        "Sklavenitis",
        "https://goo.gl/maps/LWqg6fkikD21kvbN6",
        [],
        "Not a food place per say, but this specific location of Sklavenitis sells camembert Président.",
        "3.90€ / camembert",
        Neighborhood.KOLONAKI
    );
    static CUPPOLA = new FoodPlace(
        "Cuppola",
        "https://goo.gl/maps/XxAJSMVUnt9G8keN9",
        [FoodPlaceTag.LOCAL],
        "Upscale Italian restaurant with Neapoletan-style pizza, fresh pasta and wine. Pricey for Athens.",
        "14€ / pizza",
        Neighborhood.PANGRATI,
        "https://cupola.gr/"
    );
}
