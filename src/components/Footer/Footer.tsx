import React from "react";
import "./Footer.scss";

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    return <footer className="flex-row">&copy; {currentYear}</footer>;
};
