import { FC } from "react";
import styles from "./Tag.module.scss";

interface ITagProps {
    text: string;
}

const Tag: FC<ITagProps> = (props) => {
    return <li className={styles.tag}>{props.text}</li>;
};

export default Tag;
