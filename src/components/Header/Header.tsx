import React from "react";
import Navigation from "../Navigation/Navigation";
import "./Header.scss";
import logo from "./food-blog-logo.jpeg";
import City from "../../model/City";

interface IHeaderProps {
    cities: City[];
}

export const Header: React.FC<IHeaderProps> = (props) => {
    return (
        <header className="flex-row">
            <a href="./">
                <img src={logo} className={`logo-image`} alt={"logo"} />
            </a>

            <Navigation cities={props.cities} />
        </header>
    );
};
