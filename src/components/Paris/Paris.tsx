import React, { useState } from "react";
import FoodPlaceController from "../../api/FoodPlaceController";
import FoodPlaceList from "../FoodPlaceList/FoodPlaceList";
import LoadData from "../LoadData";

export const Paris: React.FC = (props) => {
    const [promise] = useState(() => FoodPlaceController.get());

    return (
        <section id="paris">
            <h1>PARIS</h1>
            <LoadData promise={promise}>
                {(foodPlaceList) => (
                    <FoodPlaceList foodPlaceList={foodPlaceList} />
                )}
            </LoadData>
        </section>
    );
};
