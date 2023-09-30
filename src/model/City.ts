import { LatLngExpression } from "leaflet";
import { FieldType } from "./deserialization/FieldType";
import JsonDeserializationHelper from "./deserialization/JsonDeserializationHelper";

export default class City {
    name: string;
    dataFile: string;
    mapCenter: LatLngExpression;
    mapZoom: number;

    constructor(
        name: string,
        dataFile: string,
        mapCenter: LatLngExpression,
        mapZoom: number
    ) {
        this.name = name;
        this.dataFile = dataFile;
        this.mapCenter = mapCenter;
        this.mapZoom = mapZoom;
    }

    static deserialize = (data: any) => {
        const name = JsonDeserializationHelper.assertField(
            data,
            "name",
            FieldType.STRING
        );

        const dataFile = JsonDeserializationHelper.assertField(
            data,
            "dataFile",
            FieldType.STRING
        );

        if (!Array.isArray(data.mapCenter)) {
            throw Error("Expected mapCenter to be an array");
        }
        if ((data.mapCenter as any[]).length < 2) {
            throw Error("Expected mapCenter to contain at least two numbers");
        }
        if ((data.mapCenter as any[]).length > 3) {
            throw Error("Expected mapCenter to contain at most three numbers");
        }
        if (
            (data.mapCenter as any[]).find((x) => typeof x !== "number") != null
        ) {
            throw Error("Expected mapCenter to contain only numbers");
        }
        const mapCenter = data.mapCenter as LatLngExpression;

        const mapZoom = JsonDeserializationHelper.assertFieldOrDefault(
            data,
            "mapZoom",
            FieldType.NUMBER,
            13
        );

        return new City(name, dataFile, mapCenter, mapZoom);
    };
}
