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

        const mapCenter = JsonDeserializationHelper.assertLatLngExpression(
            data.mapCenter
        );

        const mapZoom = JsonDeserializationHelper.assertFieldOrDefault(
            data,
            "mapZoom",
            FieldType.NUMBER,
            13
        );

        return new City(name, dataFile, mapCenter, mapZoom);
    };
}
