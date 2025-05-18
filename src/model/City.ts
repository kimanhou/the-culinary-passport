import { LatLngExpression } from "leaflet";
import { FieldType } from "@/model/deserialization/FieldType";
import JsonDeserializationHelper from "@/model/deserialization/JsonDeserializationHelper";
import { CityEnum } from "@/ts/enum";

export default class City {
    name: CityEnum;
    dataFile: string;
    mapCenter: LatLngExpression;
    mapZoom: number;
    imageUrl: string;

    constructor(
        name: CityEnum,
        dataFile: string,
        mapCenter: LatLngExpression,
        mapZoom: number,
        imageUrl: string
    ) {
        this.name = name;
        this.dataFile = dataFile;
        this.mapCenter = mapCenter;
        this.mapZoom = mapZoom;
        this.imageUrl = imageUrl;
    }

    static deserialize = (data: any) => {
        const name = JsonDeserializationHelper.assertField(
            data,
            "name",
            FieldType.STRING
        ).toLocaleUpperCase() as CityEnum;

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

        const imageUrl = JsonDeserializationHelper.assertFieldOrDefault(
            data,
            "imageUrl",
            FieldType.STRING,
            ""
        );

        return new City(name, dataFile, mapCenter, mapZoom, imageUrl);
    };
}
