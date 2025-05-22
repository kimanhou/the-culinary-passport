import L from "leaflet";
import styles from "./Map.module.scss";

const icon = new L.Icon({
    iconUrl: "location-pin.png",
    iconRetinaUrl: "location-pin.png",
    iconSize: new L.Point(30, 30),
    className: `${styles.leafletDivIcon}`,
});

export { icon };
