const LOCAL_STORAGE_KEY = "culinary_passport_favorites";

export const getLocalStoragePlaceId = ({
    city,
    foodPlaceId,
}: {
    city: string;
    foodPlaceId: number;
}) => {
    return `${city}-${foodPlaceId}`;
};

export const isLiked = ({
    localStoragePlaceId,
}: {
    localStoragePlaceId: string;
}) => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.includes(localStoragePlaceId);
    }

    return false;
};

export const setInLocalStorage = ({
    localStoragePlaceId,
}: {
    localStoragePlaceId: string;
}) => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.includes(localStoragePlaceId)) {
            const index = parsed.indexOf(localStoragePlaceId);
            if (index > -1) {
                parsed.splice(index, 1);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
            }
        } else {
            parsed.push(localStoragePlaceId);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        }
    } else {
        localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify([localStoragePlaceId])
        );
    }
};

export const hasFavourites = (city: string) => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (stored == null) {
        return false;
    }

    const parsed = JSON.parse(stored);

    return (
        parsed.length > 0 &&
        parsed.filter((t: string) => t.startsWith(city)).length > 0
    );
};
