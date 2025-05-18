import { FC } from "react";
import "./Footer.scss";

export const Footer: FC = () => {
    const currentYear = new Date().getFullYear();
    return <footer className="flex-row">&copy; {currentYear}</footer>;
};
