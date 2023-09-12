import React, { useState, useEffect } from "react";

interface ILoadComponentProps<T> {
    promise: Promise<T>;
    children: (value: T) => React.ReactNode;
}

const LoadData = <T extends unknown>(props: ILoadComponentProps<T>) => {
    const [promiseValue, setPromiseValue] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    useEffect(() => {
        setPromiseValue(null);
        setError(null);
        props.promise
            .then((value) => {
                setPromiseValue(value);
            })
            .catch(setError);
    }, [props.promise]);
    if (error != null) {
        return <div></div>;
    }
    if (promiseValue == null) {
        return <div>Loading...</div>;
    }
    return <>{props.children(promiseValue)}</>;
};
export default LoadData;
