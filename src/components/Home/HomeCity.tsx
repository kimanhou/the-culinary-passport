import { FC } from "react";
import { Link } from "react-router-dom";
import City from "@/model/City";
import styles from "./HomeCity.module.scss";

interface IHomeCityProps {
    city: City;
}

const HomeCity: FC<IHomeCityProps> = (props) => {
    return (
        <Link
            className={styles.homeCity}
            to={props.city.name.toLocaleLowerCase()}
            style={{ backgroundImage: `url(${props.city.imageUrl})` }}
        >
            {props.city.name}
        </Link>
    );
};

export default HomeCity;
