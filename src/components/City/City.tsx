import React, { useState } from "react";
import { useEffect } from "react";
import { FoodPlaceController } from "../../api/FoodPlaceController";
import CityModel from "../../model/City";
import FoodPlace from "../../model/FoodPlace";
import FilterDropDown from "../FilterDropDown/FilterDropDown";
import FoodPlaceList from "../FoodPlaceList/FoodPlaceList";
import LoadData from "../LoadData";
import "./City.scss";

interface ICityProps {
    city: CityModel;
}

const City: React.FC<ICityProps> = (props) => {
    const [promise, setPromise] = useState(new Promise<FoodPlace[]>(() => {}));
    const [typeOfCuisineOptions, setTypeOfCuisineOptions] = useState<string[]>(
        []
    );

    useEffect(() => {
        const controller = new FoodPlaceController(props.city);
        const foodPlaces = controller.get();
        setPromise(() => foodPlaces);
        foodPlaces.then((t) => {
            setTypeOfCuisineOptions(
                Array.from(new Set<string>(t.flatMap((v) => v.typeOfCuisine)))
            );
        });
    }, [props.city]);

    return (
        <section id="city">
            <h1>{props.city.name.toLocaleUpperCase()}</h1>
            {typeOfCuisineOptions.length > 0 && (
                <FilterDropDown options={typeOfCuisineOptions} />
            )}
            <LoadData promise={promise}>
                {(foodPlaceList) => (
                    <FoodPlaceList foodPlaceList={foodPlaceList} />
                )}
            </LoadData>
        </section>
    );
};

export default City;
