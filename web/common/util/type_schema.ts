import { Dayjs } from "dayjs";

export type MapSchemaTypes = {
    string: string;
    number: number;
    date: Dayjs;
}

export type MapSchema<T extends Record<string, keyof MapSchemaTypes>> = {
    -readonly [K in keyof T]: MapSchemaTypes[T[K]]
}

export function asSchema<T extends Record<string, keyof MapSchemaTypes>>(t: T): T {
    return t;
}