import { CityEnum } from "./enum";

export const getValueOrDefault = (s: string | null | undefined) => {
    if (!s) {
        return "";
    }

    return s;
};

export const scrollTo = ({ elementId }: { elementId: string }) => {
    const myElement = document.getElementById(elementId);
    if (!myElement) return;

    myElement.scrollIntoView();
};

export const getFoodPlaceId = (foodPlaceName: string) => {
    return (
        foodPlaceName
            // eslint-disable-next-line
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
            // eslint-disable-next-line
            .replace(/'/g, "")
            // eslint-disable-next-line
            .replace(/\s+/g, "-")
            .toLocaleLowerCase()
    );
};

export const getFullScreenLink = ({
    city,
    foodPlaceId,
}: {
    city: CityEnum;
    foodPlaceId: string;
}) => {
    const baseUrl = "https://kimanhou.github.io/the-culinary-passport/#";
    return `${baseUrl}/${city.toLocaleLowerCase()}/${foodPlaceId}`;
};
