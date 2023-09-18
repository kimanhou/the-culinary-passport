import React from "react";

interface IHomeCityProps {
    city: string;
}

const HomeCity: React.FC<IHomeCityProps> = (props) => {
    return (
        <a className="home-city flex-row" href={`./${props.city}`}>
            {props.city.toUpperCase()}
        </a>
    );
};

export default HomeCity;
