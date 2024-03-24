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
    return foodPlaceName
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .replace(/'/g, "")
        .replace(/\s+/g, "-")
        .toLocaleLowerCase();
};
