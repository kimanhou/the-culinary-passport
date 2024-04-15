import React, { useEffect, useRef } from "react";
import Toast, { ToastType } from "../Toast/Toast";
import "./ToastList.scss";

interface IToastListProps {
    data: ToastType[];
    position: string;
    removeToast: (id: number) => void;
}

const ToastList = ({ data, position, removeToast }: IToastListProps) => {
    const listRef = useRef<HTMLDivElement>(null);

    const handleScrolling = (el: HTMLDivElement | null) => {
        const isTopPosition = ["top-left", "top-right"].includes(position);
        if (isTopPosition) {
            el?.scrollTo(0, el.scrollHeight);
        } else {
            el?.scrollTo(0, 0);
        }
    };

    useEffect(() => {
        handleScrolling(listRef.current);
    }, [position, data]);

    const sortedData = position.includes("bottom")
        ? [...data].reverse()
        : [...data];

    return (
        <>
            {sortedData.length > 0 && (
                <div
                    className={`toast-list toast-list--${position}`}
                    aria-live="assertive"
                    ref={listRef}
                >
                    {sortedData.map((toast) => (
                        <Toast
                            key={toast.id}
                            message={toast.message}
                            type={toast.type}
                            onClose={() => removeToast(toast.id)}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default ToastList;
