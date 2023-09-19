import React from "react";
import City from "../../model/City";
import "./Navigation.scss";
import NavigationLink from "./NavigationLink";

interface INavigationProps {
    cities: City[];
}

const Navigation: React.FC<INavigationProps> = (props) => {
    return (
        <div id="navigation" className={`flex-row`}>
            {props.cities.map((t) => (
                <NavigationLink to={`/${t.name}`} key={t.name}>
                    {t.name.toLocaleUpperCase()}
                </NavigationLink>
            ))}
        </div>
    );
};

export default Navigation;
