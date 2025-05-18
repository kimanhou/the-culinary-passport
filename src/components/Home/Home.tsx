import { FC } from "react";
import City from "@/model/City";
import HomeCity from "@/components/Home/HomeCity";
import "./Home.scss";

interface IHomeProps {
    cities: City[];
}

const Home: FC<IHomeProps> = (props) => {
    return (
        <div id="home">
            <h2>Choose your destination</h2>
            <div className="home-cities flex-row">
                {props.cities.map((t) => (
                    <HomeCity city={t} key={t.name} />
                ))}
            </div>
        </div>
    );
};

export default Home;
