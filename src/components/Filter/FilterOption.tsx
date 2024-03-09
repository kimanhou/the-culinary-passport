import React, { Dispatch, FC, SetStateAction } from "react";
import "./FilterOption.scss";

interface IFilterOptionProps {
    option: string;
    isSelected: boolean;
    setSelectedOptions: Dispatch<SetStateAction<string[]>>;
}

const FilterOption: FC<IFilterOptionProps> = (props) => {
    const isSelectedClassName = props.isSelected ? "selected" : "";
    const onClick = () => {
        props.setSelectedOptions((t) => [...t, props.option]);
    };

    return (
        <button
            className={`filter-option ${isSelectedClassName}`}
            onClick={onClick}
        >
            <span>{props.option}</span>
        </button>
    );
};

export default FilterOption;
