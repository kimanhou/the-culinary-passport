import { FC } from "react";
import styles from "./Toggle.module.scss";

interface IToggleProps {
    checked: boolean;
    onChange: () => void;
    disabled: boolean;
}

const Toggle: FC<IToggleProps> = (props) => {
    const disabledClassName = props.disabled ? styles.disabled : "";

    return (
        <label className={`${styles.switch} ${disabledClassName}`}>
            <input
                type="checkbox"
                hidden
                checked={props.checked}
                onChange={props.onChange}
                disabled={props.disabled}
            />
            <div className={styles.switchWrapper}>
                <div className={styles.switchToggle}></div>
            </div>
        </label>
    );
};

export default Toggle;
