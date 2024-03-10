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
        if (!props.isSelected) {
            props.setSelectedOptions((t) => [...t, props.option]);
        } else {
            props.setSelectedOptions((t) =>
                t.filter((t) => t !== props.option)
            );
        }
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
