import React from "react";
import SuccessIcon from "assets/SuccessIcon";
import WarningIcon from "assets/WarningIcon";
import FailureIcon from "assets/FailureIcon";
import { ToastNotificationEnum } from "ts/enum";
import styles from "./Toast.module.scss";

export type ToastType = {
    id: number;
    message: string;
    type: ToastNotificationEnum;
};

interface IToastProps {
    message: string;
    type: ToastNotificationEnum;
    onClose: () => void;
}

export const TOAST_NOTIF_CONSTANTS = {
    SUCCESS: {
        icon: <SuccessIcon />,
        color: "#5DA271",
    },
    FAILURE: {
        icon: <FailureIcon />,
        color: "#f25c54",
    },
    WARNING: {
        icon: <WarningIcon />,
        color: "#f79d65",
    },
};

const Toast = ({ message, type, onClose }: IToastProps) => {
    const toastIcon: React.JSX.Element | null =
        TOAST_NOTIF_CONSTANTS[type].icon || null;

    return (
        <div
            className={styles.toast}
            role="alert"
            onClick={onClose}
            style={{
                borderRight: `solid 6px ${TOAST_NOTIF_CONSTANTS[type].color}`,
            }}
        >
            <div className={styles["toast-message"]}>
                {toastIcon && (
                    <div
                        className={`${styles["icon"]} ${styles["icon--thumb"]}`}
                    >
                        {toastIcon}
                    </div>
                )}
                <p>{message}</p>
            </div>
        </div>
    );
};

export default Toast;
