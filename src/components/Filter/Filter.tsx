import React, { FC, ReactNode, useState } from "react";
import "./Filter.scss";
import FilterOption from "./FilterOption";

interface IFilterProps {
    filterName: string;
    icon: ReactNode;
    options: string[];
    selectedOption: string;
    setSelectedOption: (selectedOption: string) => void;
}

const Filter: FC<IFilterProps> = (props) => {
    const [areOptionsVisible, setAreOptionsVisible] = useState(false);
    const underlineVisibleClassName = areOptionsVisible ? "visible" : "";

    return (
        <div className={`filter`}>
            <div
                className="filter-header flex-column align-items-center"
                onClick={() => setAreOptionsVisible((t) => !t)}
            >
                {props.icon}
                <label className={`filter-label`}>{props.filterName}</label>
            </div>

            <div className={`filter-underline ${underlineVisibleClassName}`} />

            {areOptionsVisible && (
                <div className="filter-options-container flex-row">
                    {props.options.sort().map((t) => (
                        <FilterOption
                            key={t}
                            option={t}
                            isSelected={props.selectedOption === t}
                            setSelectedOption={props.setSelectedOption}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Filter;
