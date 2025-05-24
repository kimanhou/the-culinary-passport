import { FC, useState } from "react";
import FoodPlaceImage from "@/components/FoodPlaceList/Card/Images/FoodPlaceImage";
import Heart from "@/components/common/Heart/Heart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronRight,
    faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./FoodPlaceImages.module.scss";

interface IFoodPlaceImagesProps {
    images: string[];
    foodPlaceName: string;
    foodPlaceId: string;
    isLiked: boolean;
    onLike: () => void;
    isFullScreen: boolean;
}

const FoodPlaceImages: FC<IFoodPlaceImagesProps> = (props) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const isFullScreenClassName = props.isFullScreen ? styles.fullScreen : "";
    const imageWidth = props.isFullScreen
        ? (window.innerWidth * 30) / 100 // 30vw
        : 300; // 300px

    const canPrevious = props.images.length > 1 && selectedIndex > 0;
    const canNext =
        props.images.length > 1 && selectedIndex < props.images.length - 1;

    const onClickPrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setSelectedIndex((t) => t - 1);
        scrollToImage(selectedIndex - 1);
    };

    const onClickNext = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setSelectedIndex((t) => t + 1);
        scrollToImage(selectedIndex + 1);
    };

    const imagesId = `food-place-images-${props.foodPlaceId}`;

    const scrollToImage = (selectedIndex: number) => {
        const scrollValue =
            window.innerWidth < 600 ? window.innerWidth - 16 : imageWidth;
        document.querySelector(`#${imagesId}`)?.scrollTo({
            left: selectedIndex * scrollValue,
            behavior: "smooth",
        });
    };

    return (
        <div
            className={`${styles.foodPlaceImagesWrapper} ${isFullScreenClassName}`}
        >
            <div className={styles.foodPlaceImagesContainer}>
                <div id={imagesId} className={styles.foodPlaceImages}>
                    <span className={styles.heartWrapper}>
                        <Heart
                            isFilled={props.isLiked}
                            setInLocalStorage={props.onLike}
                        />
                    </span>
                    {props.images.map((image, i) => (
                        <div className={styles.foodPlaceImageContainer} key={i}>
                            <FoodPlaceImage
                                src={image}
                                index={i}
                                foodPlaceName={props.foodPlaceName}
                                setSelectedIndex={setSelectedIndex}
                            />
                        </div>
                    ))}
                </div>
                {props.images.length > 1 && (
                    <>
                        {canPrevious && (
                            <button
                                className={`${styles.carouselButton} ${styles.carouselButtonPrev}`}
                                onClick={onClickPrevious}
                            >
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>
                        )}
                        {canNext && (
                            <button
                                className={`${styles.carouselButton} ${styles.carouselButtonNext}`}
                                onClick={onClickNext}
                            >
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        )}
                    </>
                )}
            </div>
            {props.images.length > 1 && (
                <div className={styles.carouselDots}>
                    {props.images.map((t, i) => (
                        <span
                            className={`${styles.dot} ${
                                selectedIndex === i ? styles.selected : ""
                            }`}
                            key={i}
                        ></span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FoodPlaceImages;
