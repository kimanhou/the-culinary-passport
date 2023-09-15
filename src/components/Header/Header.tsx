import React from "react";
import Navigation from "../Navigation/Navigation";
import "./Header.scss";
import logo from "./food-blog-logo.png";

export const Header: React.FC = (props) => {
    return (
        <header className="flex-row">
            <img src={logo} className={`logo-image`} alt={"logo"} />

            <Navigation />
        </header>
    );
};
