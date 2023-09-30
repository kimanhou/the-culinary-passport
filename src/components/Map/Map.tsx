import { LatLngExpression } from "leaflet";
import React from "react";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import "./Map.scss";

interface IMapProps {
    center: LatLngExpression;
    zoom: number;
}

const Map: React.FC<IMapProps> = (props) => {
    console.log("MAP", props.center, props.zoom);
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
            <Marker position={[51.505, -0.09]}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default Map;
