import React, { FC } from "react";
import "./FilterOption.scss";

interface IFilterOptionProps {
    option: string;
    isSelected: boolean;
    setSelectedOptions: (value: string) => void;
}

const FilterOption: FC<IFilterOptionProps> = (props) => {
    const isSelectedClassName = props.isSelected ? "selected" : "";

    return (
        <button
            className={`filter-option ${isSelectedClassName}`}
            onClick={() => props.setSelectedOptions(props.option)}
        >
            <span>{props.option}</span>
        </button>
    );
};

export default FilterOption;
