import { LatLngExpression } from "leaflet";
import { FieldType } from "./deserialization/FieldType";
import JsonDeserializationHelper from "./deserialization/JsonDeserializationHelper";

export default class MapMarker {
    coordinates: LatLngExpression;
    popUpText: string;

    constructor(coordinates: LatLngExpression, popUpText: string) {
        this.coordinates = coordinates;
        this.popUpText = popUpText;
    }
}
