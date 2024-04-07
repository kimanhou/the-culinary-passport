import React, {
    useState,
    useRef,
    useEffect,
    Dispatch,
    SetStateAction,
} from "react";
import { useIsMobile } from "hooks/useIsMobile";
import FoodPlaceModel from "model/FoodPlace";
import FoodPlaceTags from "./FoodPlaceTags";
import FoodPlaceIcons from "./FoodPlaceIcons";
import FoodPlaceImages from "./FoodPlaceImages";
import { CityEnum } from "ts/enum";
import { getFoodPlaceId } from "ts/utils";
import { getLocalStoragePlaceId, isLiked } from "ts/favouriteUtils";
import CloseIcon from "assets/CloseIcon";
import "./FoodPlaceCard.scss";

interface IFoodPlaceCardProps {
    city: CityEnum;
    foodPlace: FoodPlaceModel;
    onLike: (foodPlaceId: number) => void;
    isFullScreen: boolean;
    setIsFullScreen: Dispatch<SetStateAction<boolean>>;
    setHeight?: (height: string) => void;
}

const FoodPlaceCard: React.FC<IFoodPlaceCardProps> = (props) => {
    const isMobile = useIsMobile();

    const cardRef = useRef<HTMLDivElement>(null);
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const [lineClamp, setLineClamp] = useState<number | undefined>(4);
    const [maxHeight, setMaxHeight] = useState<number | undefined>(300);
    const [isReadMoreVisible, setIsReadMoreVisible] = useState(false);
    const [isReadLessVisible, setIsReadLessVisible] = useState(false);

    const isFullScreenClassName = props.isFullScreen ? "full-screen" : "";
    const foodPlaceId = getFoodPlaceId(props.foodPlace.name);
    const localStoragePlaceId = getLocalStoragePlaceId({
        city: props.city,
        foodPlaceId: props.foodPlace.id,
    });

    const onClickReadButton = () => {
        setLineClamp((t) => {
            if (t) {
                return undefined;
            }
            return 4;
        });

        setMaxHeight((t) => {
            if (t) {
                return undefined;
            }
            return 300;
        });

        setIsReadLessVisible((t) => !t);
        setIsReadMoreVisible((t) => !t);
    };

    useEffect(() => {
        if (cardRef.current == null) return;
        const setHeight = props.setHeight;
        const resizeObserver = new ResizeObserver(() => {
            if (setHeight != null) {
                setHeight(`${cardRef.current?.clientHeight}px`);
            }
        });
        resizeObserver.observe(cardRef.current);
        return () => resizeObserver.disconnect();
    }, [props.setHeight]);

    const onFullScreenChange = () => {
        props.setIsFullScreen((t) => !t);
        setLineClamp((t) => {
            if (t) {
                return undefined;
            }
            return 4;
        });

        setMaxHeight((t) => {
            if (t) {
                return undefined;
            }
            return 300;
        });
    };

    const closeFullScreen = () => {
        onFullScreenChange();

        document.body.style.overflow = "unset";
        const url = `#/${props.city.toLocaleLowerCase()}`;
        window.history.pushState(null, "", url);
    };

    const openFullScreen = () => {
        onFullScreenChange();

        document.body.style.overflow = "hidden";
        const url = `#/${props.city.toLocaleLowerCase()}/${foodPlaceId}`;
        window.history.pushState(foodPlaceId, "", url);
    };

    const onClickName = () => {
        // Do not open full screen when it's already opened, and on mobile
        if (!props.isFullScreen && !isMobile) {
            openFullScreen();
        }
    };

    useEffect(() => {
        if (
            descriptionRef?.current &&
            descriptionRef.current.offsetHeight <
                descriptionRef.current.scrollHeight
        ) {
            setIsReadMoreVisible(true);
        }
    }, []);

    return (
        <div
            className={`food-place-card ${isFullScreenClassName}`}
            ref={cardRef}
        >
            {props.foodPlace.images && (
                <FoodPlaceImages
                    images={props.foodPlace.images}
                    foodPlaceName={props.foodPlace.name}
                    foodPlaceId={foodPlaceId}
                    isLiked={isLiked({ localStoragePlaceId })}
                    onLike={() => props.onLike(props.foodPlace.id)}
                    isFullScreen={props.isFullScreen}
                />
            )}

            <div
                className="food-place-card-content flex-column"
                style={{ maxHeight }}
            >
                {props.isFullScreen && <CloseIcon onClick={closeFullScreen} />}
                <h5>{props.foodPlace.neighborhood}</h5>
                <h3 onClick={onClickName}>{props.foodPlace.name}</h3>
                <FoodPlaceTags
                    tags={[
                        ...props.foodPlace.tags,
                        ...props.foodPlace.typeOfCuisine,
                        props.foodPlace.price,
                    ].filter((t) => t !== "")}
                />
                <div className="food-place-card-description-wrapper flex-1">
                    <p
                        style={{ WebkitLineClamp: lineClamp }}
                        ref={descriptionRef}
                    >
                        {props.foodPlace.description}
                    </p>
                    {isReadMoreVisible && !props.isFullScreen && (
                        <button onClick={onClickReadButton}>Read more</button>
                    )}
                    {isReadLessVisible && !props.isFullScreen && (
                        <button onClick={onClickReadButton}>Read less</button>
                    )}
                </div>
                <FoodPlaceIcons
                    googleMaps={props.foodPlace.googleMaps}
                    instagram={props.foodPlace.instagram}
                    website={props.foodPlace.website}
                />
            </div>
        </div>
    );
};

export default FoodPlaceCard;
