import { useState } from "react";
import { ToastType } from "components/ToastNotification/Toast/Toast";
import { AUTO_CLOSE_DURATION } from "components/ToastNotification/constants";
import { ToastNotificationEnum } from "ts/enum";

export const useToastNotifications = () => {
    const [toasts, setToasts] = useState<ToastType[]>([]);

    const removeToast = (id: number) => {
        setToasts((prevToasts) =>
            prevToasts.filter((toast) => toast.id !== id)
        );
    };

    const showToast = (message: string, type: ToastNotificationEnum) => {
        const toast = {
            id: Date.now(),
            message,
            type,
        };

        setToasts((prevToasts) => [...prevToasts, toast]);

        setTimeout(() => {
            removeToast(toast.id);
        }, AUTO_CLOSE_DURATION * 1000 + 100);
    };

    return { toasts, removeToast, showToast };
};
