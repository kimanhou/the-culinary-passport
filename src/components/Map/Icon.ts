import L from "leaflet";

const icon = new L.Icon({
    iconUrl: require("../FoodPlaceList/googleMaps.png"),
    iconRetinaUrl: require("../FoodPlaceList/googleMaps.png"),
    iconSize: new L.Point(25, 41),
    className: "leaflet-div-icon",
});

export { icon };
