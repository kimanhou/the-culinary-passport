import React, { FC } from "react";
import "./Toggle.scss";

interface IToggleProps {
    checked: boolean;
    onChange: () => void;
}

const Toggle: FC<IToggleProps> = (props) => {
    return (
        <label className="switch">
            <input
                type="checkbox"
                hidden
                checked={props.checked}
                onChange={props.onChange}
            />
            <div className="switch__wrapper">
                <div className="switch__toggle"></div>
            </div>
        </label>
    );
};

export default Toggle;
