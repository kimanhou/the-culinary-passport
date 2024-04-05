import { CityEnum, StayEnum } from "ts/enum";

const LOCAL_STORAGE_KEY = "culinary_passport_cities";

// Data structure
// {
//     LONDON: {
//         stayType: 'TOURIST',
//     },
//     TOKYO: {
//         stayType: 'LOCAL'
//     },
// }

export const getStayTypeFromLocalStorage = ({ city }: { city: CityEnum }) => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
        const parsed = JSON.parse(stored);
        return parsed[city]?.stayType;
    }

    return StayEnum.TOURIST;
};

export const setStayTypeInLocalStorage = ({
    city,
    stayType,
}: {
    city: CityEnum;
    stayType: StayEnum;
}) => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
        const parsed = JSON.parse(stored);
        parsed[city] = { stayType };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
    } else {
        const objectToSet: any = {};
        objectToSet[city] = { stayType };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(objectToSet));
    }
};
