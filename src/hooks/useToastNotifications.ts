import { ToastType } from "components/ToastNotification/Toast/Toast";
import { useState } from "react";
import { ToastNotificationEnum } from "ts/enum";

export const useToastNotifications = () => {
    const [toasts, setToasts] = useState<ToastType[]>([]);
    const [autoClose, setAutoClose] = useState(true);
    const [autoCloseDuration, setAutoCloseDuration] = useState(5);
    const [position, setPosition] = useState("top-right");

    const removeToast = (id: number) => {
        setToasts((prevToasts) =>
            prevToasts.filter((toast) => toast.id !== id)
        );
    };

    const removeAllToasts = () => {
        setToasts([]);
    };

    const showToast = (message: string, type: ToastNotificationEnum) => {
        const toast = {
            id: Date.now(),
            message,
            type,
        };

        setToasts((prevToasts) => [...prevToasts, toast]);

        if (autoClose) {
            setTimeout(() => {
                removeToast(toast.id);
            }, autoCloseDuration * 1000);
        }
    };

    return { toasts, position, removeToast, showToast };
};
