import React, { FC } from "react";
import "./Toggle.scss";

interface IToggleProps {
    checked: boolean;
    onChange: () => void;
    disabled: boolean;
}

const Toggle: FC<IToggleProps> = (props) => {
    const disabledClassName = props.disabled ? "disabled" : "";

    return (
        <label className={`switch ${disabledClassName}`}>
            <input
                type="checkbox"
                hidden
                checked={props.checked}
                onChange={props.onChange}
                disabled={props.disabled}
            />
            <div className="switch__wrapper">
                <div className="switch__toggle"></div>
            </div>
        </label>
    );
};

export default Toggle;
