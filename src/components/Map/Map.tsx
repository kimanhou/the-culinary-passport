import { FC } from "react";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import MapMarker from "@/model/MapMarker";
import { icon } from "@/components/Map/Icon";
import { scrollTo, getFoodPlaceId } from "@/ts/utils";
import styles from "./Map.module.scss";

interface IMapProps {
    center: LatLngExpression;
    zoom: number;
    markers: MapMarker[];
}

const Map: FC<IMapProps> = (props) => {
    const onIconClick = (foodPlaceName: string) => {
        scrollTo({
            elementId: `food-place-${getFoodPlaceId(foodPlaceName)}`,
        });
    };

    return (
        <MapContainer
            className={styles.map}
            center={props.center}
            zoom={props.zoom}
            scrollWheelZoom={false}
            style={{ height: "calc(100vh - 4rem)" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {props.markers.map((t) => (
                <Marker key={t.popUpText} position={t.coordinates} icon={icon}>
                    <Popup>
                        {t.popUpText}{" "}
                        <span
                            className={styles.markerPopupIcon}
                            onClick={() => onIconClick(t.popUpText)}
                        >
                            🚀
                        </span>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
