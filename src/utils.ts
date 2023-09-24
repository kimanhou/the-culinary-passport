export const getValueOrDefault = (s: string | null | undefined) => {
    if (!s) {
        return "";
    }

    return s;
};
