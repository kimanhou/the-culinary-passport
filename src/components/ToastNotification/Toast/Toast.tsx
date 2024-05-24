import React, { useEffect, useRef, useState } from "react";
import { ToastNotificationEnum } from "ts/enum";
import styles from "./Toast.module.scss";
import {
    AUTO_CLOSE_DURATION,
    TYPES,
} from "components/ToastNotification/constants";

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

const Toast = ({ message, type, onClose }: IToastProps) => {
    const [isExiting, setIsExiting] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const toastIcon: React.JSX.Element | null = TYPES[type].icon || null;

    const isExitingClassName = isExiting
        ? styles["is-exiting"]
        : styles["is-entering"];

    const onClick = () => {
        setIsExiting(true);
    };

    const onTransitionEnd = () => {
        if (isExiting) {
            onClose();
        }
    };

    useEffect(() => {
        ref.current?.addEventListener("transitionend", onTransitionEnd);

        setTimeout(() => {
            setIsExiting(true);
        }, AUTO_CLOSE_DURATION * 1000);

        return () =>
            ref.current?.removeEventListener("transitionend", onTransitionEnd);
    }, []);

    return (
        <div
            className={`${styles.toast} ${isExitingClassName}`}
            role="alert"
            onClick={onClick}
            style={{
                borderRight: `solid 6px ${TYPES[type].color}`,
            }}
            ref={ref}
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
