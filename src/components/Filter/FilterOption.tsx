import { FC } from "react";
import styles from "./FilterOption.module.scss";

interface IFilterOptionProps {
    option: string;
    isSelected: boolean;
    setSelectedOptions: (value: string) => void;
}

const FilterOption: FC<IFilterOptionProps> = (props) => {
    const isSelectedClassName = props.isSelected ? styles.selected : "";

    return (
        <button
            className={`${styles.filterOption} ${isSelectedClassName}`}
            onClick={() => props.setSelectedOptions(props.option)}
        >
            <span>{props.option}</span>
        </button>
    );
};

export default FilterOption;
