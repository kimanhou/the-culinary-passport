import { FC } from "react";
import heart from "@/assets/heart.png";
import styles from "./Filter.module.scss";

interface IFavouritesFilterProps {
    isSelected: boolean;
    onChange: () => void;
}

const FavouritesFilter: FC<IFavouritesFilterProps> = (props) => {
    return (
        <div className={styles.filter}>
            <div
                className={styles.filterHeader}
                onClick={() => props.onChange()}
            >
                <img src={heart} alt={"Favourites filter icon"} />
                <label className={styles.filterLabel}>My favorites</label>
            </div>

            <div
                className={`${styles.filterUnderline} ${
                    props.isSelected ? styles.visible : ""
                }`}
            />
        </div>
    );
};

export default FavouritesFilter;
