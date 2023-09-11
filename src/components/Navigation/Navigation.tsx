import React from "react";
import "./Navigation.scss";
import NavigationLink from "./NavigationLink";

interface INavigationProps {}

const Navigation: React.FC<INavigationProps> = (props) => {
    return (
        <div id="navigation" className={`flex-row`}>
            <NavigationLink to="/paris" selected={true}>
                PARIS
            </NavigationLink>
            <NavigationLink to="/montreal" selected={true}>
                MONTREAL
            </NavigationLink>
        </div>
    );
};

export default Navigation;
