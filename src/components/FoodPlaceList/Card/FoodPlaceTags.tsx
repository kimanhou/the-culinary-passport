import { FC } from "react";
import Tag from "@/components/common/Tag/Tag";
import styles from "./FoodPlaceTags.module.scss";

interface IFoodPlaceTagsProps {
    tags: string[];
}

const FoodPlaceTags: FC<IFoodPlaceTagsProps> = (props) => {
    return (
        <ul className={styles.foodPlaceTags}>
            {props.tags.map((tag, i) => (
                <Tag key={i.toString()} text={tag} />
            ))}
        </ul>
    );
};

export default FoodPlaceTags;
