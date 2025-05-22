import { Dispatch, FC, SetStateAction } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap, faList } from "@fortawesome/free-solid-svg-icons";
import styles from "./ShowMapButton.module.scss";

interface IShowMapButtonProps {
    isMapShown: boolean;
    setIsMapShown: Dispatch<SetStateAction<boolean>>;
}

const ShowMapButton: FC<IShowMapButtonProps> = (props) => {
    return (
        <button
            className={styles.showMapButton}
            onClick={() => props.setIsMapShown((t) => !t)}
        >
            {!props.isMapShown && (
                <span>
                    Show map <FontAwesomeIcon icon={faMap} />
                </span>
            )}
            {props.isMapShown && (
                <span>
                    Show list <FontAwesomeIcon icon={faList} />
                </span>
            )}
        </button>
    );
};

export default ShowMapButton;
