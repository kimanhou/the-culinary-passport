import React, { useState } from "react";
import { FoodPlaceControllerMontreal } from "../../api/FoodPlaceController";
import FoodPlaceList from "../FoodPlaceList/FoodPlaceList";
import LoadData from "../LoadData";

export const Montreal: React.FC = (props) => {
    const [promise] = useState(() => FoodPlaceControllerMontreal.get());

    return (
        <section id="montreal">
            <h1>MONTREAL</h1>
            <LoadData promise={promise}>
                {(foodPlaceList) => (
                    <FoodPlaceList foodPlaceList={foodPlaceList} />
                )}
            </LoadData>
        </section>
    );
};
