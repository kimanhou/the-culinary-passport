import L from "leaflet";

const icon = new L.Icon({
    iconUrl: "location-pin.png",
    iconRetinaUrl: "location-pin.png",
    iconSize: new L.Point(30, 30),
    className: "leaflet-div-icon",
});

export { icon };
