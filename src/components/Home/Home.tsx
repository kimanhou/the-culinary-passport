import React from "react";
import City from "model/City";
import HomeCity from "./HomeCity";
import "./Home.scss";

interface IHomeProps {
    cities: City[];
}

const Home: React.FC<IHomeProps> = (props) => {
    return (
        <div id="home">
            <h1>Choose your destination</h1>
            <div className="home-cities flex-row">
                {props.cities.map((t) => (
                    <HomeCity city={t.name} key={t.name} />
                ))}
            </div>
        </div>
    );
};

export default Home;
