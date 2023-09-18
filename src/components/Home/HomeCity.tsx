import React from "react";
import { Link } from "react-router-dom";

interface IHomeCityProps {
    city: string;
}

const HomeCity: React.FC<IHomeCityProps> = (props) => {
    return (
        <Link className="home-city flex-row" to={props.city}>
            {props.city.toUpperCase()}
        </Link>
    );
};

export default HomeCity;
