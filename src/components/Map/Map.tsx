import { LatLngExpression } from "leaflet";
import React from "react";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import MapMarker from "../../model/MapMarker";
import { icon } from "./Icon";
import "./Map.scss";

interface IMapProps {
    center: LatLngExpression;
    zoom: number;
    markers: MapMarker[];
}

const Map: React.FC<IMapProps> = (props) => {
    return (
        <MapContainer
            id="map"
            center={props.center}
            zoom={props.zoom}
            scrollWheelZoom={false}
            style={{ height: "500px" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {props.markers.map((t) => (
                <Marker position={t.coordinates} icon={icon}>
                    <Popup>{t.popUpText}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
