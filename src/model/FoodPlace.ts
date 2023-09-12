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
}
