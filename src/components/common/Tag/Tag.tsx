import { FC } from "react";
import "./Tag.scss";

interface ITagProps {
    text: string;
}

const Tag: FC<ITagProps> = (props) => {
    return <li className="tag">{props.text}</li>;
};

export default Tag;
