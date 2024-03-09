import React, { Dispatch, FC, SetStateAction } from "react";
import "./FilterOption.scss";

interface IFilterOptionProps {
    option: string;
    isSelected: boolean;
    setSelectedOption: (selectedOption: string) => void;
}

const FilterOption: FC<IFilterOptionProps> = (props) => {
    const isSelectedClassName = props.isSelected ? "selected" : "";
    return (
        <button
            className={`filter-option ${isSelectedClassName}`}
            onClick={() => props.setSelectedOption(props.option)}
        >
            <span>{props.option}</span>
        </button>
    );
};

export default FilterOption;
