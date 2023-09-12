export const arrayHandler = <T> (deserializer : (json : any) => T) => {
    return (json : any[]) => json.map(x => deserializer(x));
}