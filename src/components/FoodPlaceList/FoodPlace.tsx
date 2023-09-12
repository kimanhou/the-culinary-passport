import React from "react";
import FoodPlaceModel from "../../model/FoodPlace";
import "./FoodPlace.scss";

interface IFoodPlaceProps {
    foodPlace: FoodPlaceModel;
}

const FoodPlace: React.FC<IFoodPlaceProps> = (props) => {
    return (
        <div className={`food-place`}>
            <h3>{props.foodPlace.name}</h3>
            <p>
                <b>Location: </b> {props.foodPlace.neighborhood}, exact spot{" "}
                <a
                    href={props.foodPlace.location}
                    target="_blank"
                    rel="noreferrer"
                >
                    here
                </a>
                <br></br>
                <b>Tags: </b> {props.foodPlace.tags.join(", ")}
                <br></br>
                <b>Description: </b> {props.foodPlace.description}
                <br></br>
                <b>Price: </b> {props.foodPlace.price}
                <br></br>
                {props.foodPlace.link !== undefined && (
                    <>
                        <b>Website: </b>{" "}
                        <a
                            href={props.foodPlace.location}
                            target="_blank"
                            rel="noreferrer"
                        >
                            here
                        </a>
                    </>
                )}
            </p>
        </div>
    );
};

export default FoodPlace;
