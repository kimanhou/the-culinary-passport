import React, {
    Dispatch,
    FC,
    ReactNode,
    SetStateAction,
    useState,
} from "react";
import "./Filter.scss";
import FilterOption from "./FilterOption";

interface IFilterProps {
    filterName: string;
    icon: ReactNode;
    options: string[];
    selectedOptions: string[];
    setSelectedOptions: Dispatch<SetStateAction<string[]>>;
}

const Filter: FC<IFilterProps> = (props) => {
    const [areOptionsVisible, setAreOptionsVisible] = useState(false);
    const underlineVisibleClassName = areOptionsVisible ? "visible" : "";
    const optionsVisibleClassName = areOptionsVisible ? "visible" : "";

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

            <div
                className={`filter-options-container flex-row ${optionsVisibleClassName}`}
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
