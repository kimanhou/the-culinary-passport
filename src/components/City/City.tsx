import React, { useState } from "react";
import { useEffect } from "react";
import { FoodPlaceController } from "../../api/FoodPlaceController";
import FoodPlace from "../../model/FoodPlace";
import FoodPlaceList from "../FoodPlaceList/FoodPlaceList";
import LoadData from "../LoadData";
import "./City.scss";

interface ICityProps {
    city: string;
}

const City: React.FC<ICityProps> = (props) => {
    const [promise, setPromise] = useState(new Promise<FoodPlace[]>(() => {}));

    useEffect(() => {
        const controller = new FoodPlaceController(props.city);
        setPromise(() => controller.get());
    }, [props.city]);

    return (
        <section id="city">
            <h1>{props.city.toLocaleUpperCase()}</h1>
            <LoadData promise={promise}>
                {(foodPlaceList) => (
                    <FoodPlaceList foodPlaceList={foodPlaceList} />
                )}
            </LoadData>
        </section>
    );
};

export default City;
