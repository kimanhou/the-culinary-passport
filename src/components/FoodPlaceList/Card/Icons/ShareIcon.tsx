import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { ToastNotificationEnum } from "ts/enum";

interface IShareIconProps {
    link: string;
    showToast: (message: string, type: ToastNotificationEnum) => void;
}

const ShareIcon: React.FC<IShareIconProps> = (props) => {
    const onClick = async () => {
        await navigator.clipboard.writeText(props.link);
        props.showToast(
            "Link copied to your clipboard !",
            ToastNotificationEnum.SUCCESS
        );
    };

    return (
        <button onClick={onClick} className="round-icon">
            <span className="round-icon-inner"></span>
            <FontAwesomeIcon icon={faShare} />
        </button>
    );
};

export default ShareIcon;
