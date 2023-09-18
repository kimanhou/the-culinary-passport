import React from "react";
import "./Home.scss";
import HomeCity from "./HomeCity";

const Home: React.FC = (props) => {
    const cities = ["paris", "montreal"];
    return (
        <div id="home">
            <h1>Choisis ta destination</h1>
            <div className="home-cities flex-row">
                {cities.map((t) => (
                    <HomeCity city={t} key={t} />
                ))}
            </div>
        </div>
    );
};

export default Home;
