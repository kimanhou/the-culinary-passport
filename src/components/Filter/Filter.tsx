import { FC, ReactNode, useState } from "react";
import FilterOption from "@/components/Filter/FilterOption";
import styles from "./Filter.module.scss";

interface IFilterProps {
    filterName: string;
    icon: ReactNode;
    options: string[];
    selectedOptions: string[];
    setSelectedOptions: (value: string) => void;
}

const Filter: FC<IFilterProps> = (props) => {
    const [areOptionsVisible, setAreOptionsVisible] = useState(false);
    const underlineVisibleClassName = areOptionsVisible ? styles.visible : "";
    const optionsVisibleClassName = areOptionsVisible ? styles.visible : "";

    return (
        <div className={styles.filter}>
            <div
                className={styles.filterHeader}
                onClick={() => setAreOptionsVisible((t) => !t)}
            >
                {props.icon}
                <label className={styles.filterLabel}>{props.filterName}</label>
            </div>

            <div
                className={`${styles.filterUnderline} ${underlineVisibleClassName}`}
            />

            <div
                className={`${styles.filterOptionsContainer} ${optionsVisibleClassName}`}
            >
                {props.options.sort().map((t) => (
                    <FilterOption
                        key={t}
                        option={t}
                        isSelected={props.selectedOptions.includes(t)}
                        setSelectedOptions={props.setSelectedOptions}
                    />
                ))}
            </div>
        </div>
    );
};

export default Filter;
