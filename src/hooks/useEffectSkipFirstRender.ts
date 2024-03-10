import { DependencyList, EffectCallback, useEffect, useRef } from "react";

export default function useEffectSkipFirstRender(
    fn: EffectCallback,
    inputs?: DependencyList
) {
    const isMountingRef = useRef(false);

    useEffect(() => {
        isMountingRef.current = true;
    }, []);

    useEffect(() => {
        if (!isMountingRef.current) {
            return fn();
        } else {
            isMountingRef.current = false;
        }
    }, inputs);
}
