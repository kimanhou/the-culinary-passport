import React, { useState } from "react";
import { useEffect } from "react";
import { FoodPlaceController } from "../../api/FoodPlaceController";
import CityModel from "../../model/City";
import FoodPlace from "../../model/FoodPlace";
import FoodPlaceListWithFilter from "../FoodPlaceListWithFilter/FoodPlaceListWithFilter";
import LoadData from "../LoadData";
import "./City.scss";

interface ICityProps {
    city: CityModel;
}

const City: React.FC<ICityProps> = (props) => {
    const [promise, setPromise] = useState(new Promise<FoodPlace[]>(() => {}));

    useEffect(() => {
        const controller = new FoodPlaceController(props.city);
        setPromise(() => controller.get());
    }, [props.city]);

    return (
        <section id="city">
            <h1>{props.city.name.toLocaleUpperCase()}</h1>
            <LoadData promise={promise}>
                {(foodPlaceList) => (
                    <FoodPlaceListWithFilter
                        foodPlaces={foodPlaceList}
                        mapCenter={props.city.mapCenter}
                        mapZoom={props.city.mapZoom}
                    />
                )}
            </LoadData>
        </section>
    );
};

export default City;
