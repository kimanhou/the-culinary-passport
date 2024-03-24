import { LatLngExpression } from "leaflet";
import { FieldType } from "./deserialization/FieldType";
import JsonDeserializationHelper from "./deserialization/JsonDeserializationHelper";

export default class FoodPlace {
    id: number;
    name: string;
    tags: string[];
    description: string;
    price: string;
    typeOfCuisine: string[];
    neighborhood?: string;
    images?: string[];
    googleMaps?: string;
    instagram?: string;
    website?: string;
    coordinates?: LatLngExpression;
    isLocal?: boolean;

    constructor(
        id: number,
        name: string,
        tags: string[],
        description: string,
        price: string,
        typeOfCuisine: string[],
        neighborhood?: string,
        images?: string[],
        googleMaps?: string,
        instagram?: string,
        website?: string,
        coordinates?: LatLngExpression,
        isLocal?: boolean
    ) {
        this.id = id;
        this.name = name;
        this.tags = tags;
        this.description = description;
        this.price = price;
        this.typeOfCuisine = typeOfCuisine;
        this.neighborhood = neighborhood;
        this.images = images;
        this.googleMaps = googleMaps;
        this.instagram = instagram;
        this.website = website;
        this.coordinates = coordinates;
        this.isLocal = isLocal;
    }

    static deserialize = (data: any) => {
        const id = JsonDeserializationHelper.assertField(
            data,
            "id",
            FieldType.NUMBER
        );
        const name = JsonDeserializationHelper.assertField(
            data,
            "name",
            FieldType.STRING
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
        const typeOfCuisine = JsonDeserializationHelper.assertArray(
            data,
            "typeOfCuisine",
            (t) => t.toString()
        );
        const neighborhood = JsonDeserializationHelper.assertFieldOrDefault(
            data,
            "neighborhood",
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

        const coordinates = JsonDeserializationHelper.assertLatLngExpression(
            data.coordinates
        );

        const isLocal = JsonDeserializationHelper.assertFieldOrDefault(
            data,
            "isLocal",
            FieldType.BOOLEAN,
            false
        );

        return new FoodPlace(
            id,
            name,
            tags,
            description,
            price,
            typeOfCuisine,
            neighborhood,
            images,
            googleMaps,
            instagram,
            website,
            coordinates,
            isLocal
        );
    };
}
