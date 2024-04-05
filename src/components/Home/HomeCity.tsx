import React from "react";
import { Link } from "react-router-dom";
import { CityEnum } from "ts/enum";

interface IHomeCityProps {
    city: CityEnum;
}

const HomeCity: React.FC<IHomeCityProps> = (props) => {
    return (
        <Link
            className="home-city flex-row"
            to={props.city.toLocaleLowerCase()}
        >
            {props.city}
        </Link>
    );
};

export default HomeCity;
