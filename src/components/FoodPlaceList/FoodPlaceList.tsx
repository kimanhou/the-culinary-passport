import { FC } from "react";
import FoodPlaceModel from "@/model/FoodPlace";
import { useIsMobile } from "@/hooks/useMedia";
import FoodPlaceCardFullscreenWrapper from "@/components/FoodPlaceList/Card/FoodPlaceCardFullscreenWrapper";
import { CityEnum, ToastNotificationEnum } from "@/ts/enum";
import { getFoodPlaceId } from "@/ts/utils";
import styles from "./FoodPlaceList.module.scss";

interface IFoodPlaceListProps {
    foodPlaceList: FoodPlaceModel[];
    city: CityEnum;
    onLike: (foodPlaceId: number) => void;
    showToast: (message: string, type: ToastNotificationEnum) => void;
    foodPlaceId?: string;
}

const FoodPlaceList: FC<IFoodPlaceListProps> = (props) => {
    const isMobile = useIsMobile();

    return (
        <ul className={styles.foodPlaceList}>
            {props.foodPlaceList.map((t) => (
                <li key={t.name}>
                    <FoodPlaceCardFullscreenWrapper
                        city={props.city}
                        foodPlace={t}
                        onLike={props.onLike}
                        isFullScreen={
                            !isMobile &&
                            props.foodPlaceId === getFoodPlaceId(t.name)
                        }
                        showToast={props.showToast}
                    />
                </li>
            ))}
        </ul>
    );
};

export default FoodPlaceList;
