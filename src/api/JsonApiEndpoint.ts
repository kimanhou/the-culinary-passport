import { Klass } from "../model/Types";

const handleJsonResponse = (response: Response) => {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error(response.statusText);
    }
};

export const get = <T>(endpoint: string, deserializer: (json: any) => T) => {
    return () => fetch(endpoint).then(handleJsonResponse).then(deserializer);
};

export const post = <T, R>(
    endpoint: string,
    bodyType: Klass<R>,
    deserializer: (json: any) => T
) => {
    return (body: R) =>
        fetch(endpoint, {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        })
            .then(handleJsonResponse)
            .then(deserializer);
};

export const patch = <T, R>(
    endpoint: string,
    bodyType: Klass<R>,
    deserializer: (json: any) => T
) => {
    return (body: R) =>
        fetch(endpoint, {
            method: "PATCH",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        })
            .then(handleJsonResponse)
            .then(deserializer);
};

export const del = <T>(endpoint: string, deserializer: (json: any) => T) => {
    return () =>
        fetch(endpoint, { method: "DELETE" })
            .then(handleJsonResponse)
            .then(deserializer);
};
