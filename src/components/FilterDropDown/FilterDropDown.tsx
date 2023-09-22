import React from "react";
import "./FilterDropDown.scss";

interface IFilterDropDownProps {
    filterName: string;
    options: string[];
    selectedOption: string;
    setSelectedOption: (selectedOption: string) => void;
}

const FilterDropDown: React.FC<IFilterDropDownProps> = (props) => {
    return (
        <div className={`filter`}>
            <label className={`filter-label`}>{props.filterName}</label>
            <select
                id={props.filterName}
                value={props.selectedOption}
                onChange={(e) => props.setSelectedOption(e.target.value)}
            >
                <option key="all">All</option>
                {props.options.map((t) => (
                    <option key={t}>{t}</option>
                ))}
            </select>
        </div>
    );
};

export default FilterDropDown;
