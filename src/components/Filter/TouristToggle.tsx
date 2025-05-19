import { FC } from "react";
import { StayEnum } from "@/ts/enum";
import tourist from "@/assets/tourist.png";
import local from "@/assets/local.png";
import Toggle from "@/components/common/Toggle/Toggle";
import styles from "./TouristToggle.module.scss";

interface ITouristToggle {
    stayType: string;
    onStayTypeChange: () => void;
    disabled: boolean;
}

const TouristToggle: FC<ITouristToggle> = (props) => {
    const isTourist = props.stayType === StayEnum.TOURIST;
    const disabledClassName = props.disabled ? styles.disabled : "";

    const onClickLocal = () => {
        if (props.stayType !== StayEnum.LOCAL && !props.disabled) {
            props.onStayTypeChange();
        }
    };

    const onClickTourist = () => {
        if (props.stayType !== StayEnum.TOURIST && !props.disabled) {
            props.onStayTypeChange();
        }
    };

    return (
        <div className={`${styles.touristToggle} ${disabledClassName}`}>
            <div
                className={styles.touristToggleLabelWrapper}
                onClick={onClickLocal}
            >
                <img src={local} alt="Local icon" />
                <span className={styles.toggleLabel}>I live here</span>
            </div>
            <Toggle
                checked={isTourist}
                onChange={props.onStayTypeChange}
                disabled={props.disabled}
            />
            <div
                className={styles.touristToggleLabelWrapper}
                onClick={onClickTourist}
            >
                <img src={tourist} alt="Tourist icon" />
                <span className={styles.toggleLabel}>I'm visiting</span>
            </div>
        </div>
    );
};

export default TouristToggle;
