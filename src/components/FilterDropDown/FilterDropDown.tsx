import React from "react";

interface IFilterDropDownProps {
    options: string[];
    selectedOption: string;
    setSelectedOption: (selectedOption: string) => void;
}

const FilterDropDown: React.FC<IFilterDropDownProps> = (props) => {
    return (
        <select
            value={props.selectedOption}
            onChange={(e) => props.setSelectedOption(e.target.value)}
        >
            <option key="all">All</option>
            {props.options.map((t) => (
                <option key={t}>{t}</option>
            ))}
        </select>
    );
};

export default FilterDropDown;
