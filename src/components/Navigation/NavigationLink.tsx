import React from "react";
import "./NavigationLink.scss";
import { Link, useLocation, matchPath } from "react-router-dom";

interface INavigationLinkProps {
    to: string;
    selected: boolean;
    children: React.ReactNode;
}

const NavigationLink: React.FC<INavigationLinkProps> = (props) => {
    const { pathname } = useLocation();
    const selectedClassName = matchPath(pathname, props.to) ? "selected" : "";

    return (
        <Link className={`navigation-link ${selectedClassName}`} to={props.to}>
            <div className="text grey">{props.children}</div>
            <div className="text">{props.children}</div>
        </Link>
    );
};

export default NavigationLink;
