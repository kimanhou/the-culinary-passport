import { LatLngExpression } from "leaflet";

export default class MapMarker {
    coordinates: LatLngExpression;
    popUpText: string;

    constructor(coordinates: LatLngExpression, popUpText: string) {
        this.coordinates = coordinates;
        this.popUpText = popUpText;
    }
}
