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
import "./City.scss";
import { useParams } from "react-router-dom";
import ToastList from "components/ToastNotification/List/ToastList";
import { useToastNotifications } from "hooks/useToastNotifications";

interface ICityProps {
    city: CityModel;
    isFullScreen?: boolean;
}

const City: React.FC<ICityProps> = (props) => {
    let params = useParams();

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

    useEffect(() => {
        if (props.isFullScreen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [props.isFullScreen]);

    const { toasts, position, removeToast, showToast } =
        useToastNotifications();

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
                            city={props.city.name}
                            foodPlaceId={params.foodPlaceId}
                            showToast={showToast}
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
            <ToastList
                data={toasts}
                position={position}
                removeToast={removeToast}
            />
        </section>
    );
};

export default City;
