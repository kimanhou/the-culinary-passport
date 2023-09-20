import React from "react";

interface IFilterDropDownProps {
    options: string[];
}

const FilterDropDown: React.FC<IFilterDropDownProps> = (props) => {
    return (
        <select>
            {props.options.map((t) => (
                <option>{t}</option>
            ))}
        </select>
    );
};

export default FilterDropDown;
