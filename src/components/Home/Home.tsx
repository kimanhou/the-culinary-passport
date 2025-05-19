import { FC } from "react";
import City from "@/model/City";
import HomeCity from "@/components/Home/HomeCity";
import styles from "./Home.module.scss";

interface IHomeProps {
    cities: City[];
}

const Home: FC<IHomeProps> = (props) => {
    return (
        <div className={styles.home}>
            <h2>Choose your destination</h2>
            <div className={styles.homeCities}>
                {props.cities.map((t) => (
                    <HomeCity city={t} key={t.name} />
                ))}
            </div>
        </div>
    );
};

export default Home;
