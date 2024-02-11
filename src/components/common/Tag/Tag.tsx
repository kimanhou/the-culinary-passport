import React from "react";
import "./Tag.scss";

interface ITagProps {
    text: string;
}

const Tag: React.FC<ITagProps> = (props) => {
    return <li className="tag">{props.text}</li>;
};

export default Tag;
