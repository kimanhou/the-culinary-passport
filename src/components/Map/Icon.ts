import L from "leaflet";

const icon = new L.Icon({
    iconUrl: require("../../assets/location-pin.png"),
    iconRetinaUrl: require("../../assets/location-pin.png"),
    iconSize: new L.Point(30, 30),
    className: "leaflet-div-icon",
});

export { icon };
