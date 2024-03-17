import React, { useState } from "react";
import { useEffect } from "react";
import { FoodPlaceController } from "api/FoodPlaceController";
import CityModel from "model/City";
import FoodPlace from "model/FoodPlace";
import LoadData from "components/LoadData";
import FoodPlaceListWithFilter from "components/FoodPlaceListWithFilter/FoodPlaceListWithFilter";
import ShowMapButton from "components/Map/ShowMapButton";
import SideSheet from "components/common/SideSheet/SideSheet";
import Map from "components/Map/Map";
import { Map as LeafletMap } from "leaflet";
import "./City.scss";

interface ICityProps {
    city: CityModel;
}

const City: React.FC<ICityProps> = (props) => {
    const [promise, setPromise] = useState(new Promise<FoodPlace[]>(() => {}));
    const [isMapShown, setIsMapShown] = useState(false);
    const [isMapReady, setIsMapReady] = useState(false);

    const resetMap = () => {
        setIsMapReady(true);
    };

    useEffect(() => {
        const controller = new FoodPlaceController(props.city);
        setPromise(() => controller.get());
    }, [props.city]);

    return (
        <section id="city">
            <h1>{props.city.name.toLocaleUpperCase()}</h1>
            <LoadData promise={promise}>
                {(foodPlaceList) => (
                    <>
                        <FoodPlaceListWithFilter
                            foodPlaces={foodPlaceList}
                            mapCenter={props.city.mapCenter}
                            mapZoom={props.city.mapZoom}
                        />
                        <ShowMapButton
                            isMapShown={isMapShown}
                            setIsMapShown={setIsMapShown}
                        />
                        <SideSheet
                            isVisible={isMapShown}
                            setIsVisible={setIsMapShown}
                            onEnter={resetMap}
                            onExit={() => setIsMapReady(false)}
                        >
                            {isMapReady && (
                                <Map
                                    center={props.city.mapCenter}
                                    zoom={props.city.mapZoom}
                                    markers={foodPlaceList
                                        .filter(
                                            (t) => t.coordinates !== undefined
                                        )
                                        .map((t) => {
                                            return {
                                                coordinates: t.coordinates!,
                                                popUpText: t.name,
                                            };
                                        })}
                                />
                            )}
                        </SideSheet>
                    </>
                )}
            </LoadData>
        </section>
    );
};

export default City;
