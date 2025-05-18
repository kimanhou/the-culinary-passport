import { FC } from "react";
import { Link, useLocation, matchPath } from "react-router-dom";
import "./NavigationLink.scss";

interface INavigationLinkProps {
    to: string;
    children: React.ReactNode;
}

const NavigationLink: FC<INavigationLinkProps> = (props) => {
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
