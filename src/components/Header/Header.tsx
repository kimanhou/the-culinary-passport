import React from "react";
import Navigation from "components/Navigation/Navigation";
import City from "model/City";
import Divider from "components/common/Divider/Divider";
import { useIsMobile } from "hooks/useIsMobile";
import "./Header.scss";

interface IHeaderProps {
    cities: City[];
}

export const Header: React.FC<IHeaderProps> = (props) => {
    const isMobile = useIsMobile();

    return (
        <header className="flex-column">
            <div className="tag-line flex-row align-items-center">
                <div className="tag-line-decoration left" />
                <h4>
                    <i>sibling edition</i>
                </h4>
                <div className="tag-line-decoration right" />
            </div>

            <h1 className="typeface-primary">
                <a href="./">Culinary passport</a>
            </h1>
            {!isMobile && <Navigation cities={props.cities} />}
            <Divider />
        </header>
    );
};
