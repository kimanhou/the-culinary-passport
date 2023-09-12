export type Nullable<T> = T | null;

export type NonEmptyArray<T> = {
    0 : T
} & Array<T>;

export type Klass<T> = new (...params : any[]) => T;