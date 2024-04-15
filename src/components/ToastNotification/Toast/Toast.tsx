import React from "react";
import { SuccessIcon, FailureIcon, WarningIcon } from "../Icons/Icons";
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
        color: "green",
    },
    FAILURE: {
        icon: <FailureIcon />,
    },
    WARNING: {
        icon: <WarningIcon />,
    },
};

const Toast = ({ message, type, onClose }: IToastProps) => {
    const toastIcon: React.JSX.Element | null =
        TOAST_NOTIF_CONSTANTS[type].icon || null;

    return (
        <div
            className={`${styles.toast} ${styles[`toast--${type}`]}`}
            role="alert"
            onClick={onClose}
            style={{ borderRight: "solid 6px green" }}
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
