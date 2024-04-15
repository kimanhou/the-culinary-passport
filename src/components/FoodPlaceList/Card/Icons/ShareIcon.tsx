import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";

interface IShareIconProps {
    link: string;
}

const ShareIcon: React.FC<IShareIconProps> = (props) => {
    const onClick = async () => {
        await navigator.clipboard.writeText(props.link);
        alert("Link copied to your clipboard !");
    };
    return (
        <button onClick={onClick} className="round-icon">
            <span className="round-icon-inner"></span>
            <FontAwesomeIcon icon={faShare} />
        </button>
    );
};

export default ShareIcon;
