import React from "react";
import Navigation from "components/Navigation/Navigation";
import "./Header.scss";
// import logo from "./food-blog-logo.png";
import City from "model/City";
import Divider from "components/common/Divider/Divider";

interface IHeaderProps {
    cities: City[];
}

export const Header: React.FC<IHeaderProps> = (props) => {
    return (
        <header className="flex-column">
            {/* <a href="./">
                <img src={logo} className={`logo-image`} alt={"logo"} />
            </a> */}
            <div className="tag-line flex-row align-items-center">
                <div className="tag-line-decoration left" />
                <h4>
                    <i>sibling edition</i>
                </h4>
                <div className="tag-line-decoration right" />
            </div>

            <h1 className="typeface-primary">Culinary passport</h1>
            <Navigation cities={props.cities} />
            <Divider />
        </header>
    );
};
