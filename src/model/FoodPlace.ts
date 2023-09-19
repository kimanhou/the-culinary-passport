import { FieldType } from "./deserialization/FieldType";
import JsonDeserializationHelper from "./deserialization/JsonDeserializationHelper";

export default class FoodPlace {
    name: string;
    location: string;
    tags: string[];
    description: string;
    price: string;
    images?: string[];
    googleMaps?: string;
    instagram?: string;
    website?: string;

    constructor(
        name: string,
        location: string,
        tags: string[],
        description: string,
        price: string,
        images?: string[],
        googleMaps?: string,
        instagram?: string,
        website?: string
    ) {
        this.name = name;
        this.location = location;
        this.tags = tags;
        this.description = description;
        this.price = price;
        this.images = images;
        this.googleMaps = googleMaps;
        this.instagram = instagram;
        this.website = website;
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
        const tags = JsonDeserializationHelper.assertArray(data, "tags", (t) =>
            t.toString()
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
        const images = JsonDeserializationHelper.assertArray(
            data,
            "images",
            (t) => t.toString()
        );
        const googleMaps = JsonDeserializationHelper.assertFieldOrDefault(
            data,
            "googleMaps",
            FieldType.STRING,
            ""
        );
        const instagram = JsonDeserializationHelper.assertFieldOrDefault(
            data,
            "instagram",
            FieldType.STRING,
            ""
        );
        const website = JsonDeserializationHelper.assertFieldOrDefault(
            data,
            "website",
            FieldType.STRING,
            ""
        );
        return new FoodPlace(
            name,
            location,
            tags,
            description,
            price,
            images,
            googleMaps,
            instagram,
            website
        );
    };
}
