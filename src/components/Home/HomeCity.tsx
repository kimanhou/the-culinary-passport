import React from "react";
import { Link } from "react-router-dom";
import City from "model/City";
import "./HomeCity.scss";

interface IHomeCityProps {
    city: City;
}

const HomeCity: React.FC<IHomeCityProps> = (props) => {
    return (
        <Link
            className="home-city"
            to={props.city.name.toLocaleLowerCase()}
            style={{ backgroundImage: `url(${props.city.imageUrl})` }}
        >
            {props.city.name}
        </Link>
    );
};

export default HomeCity;
