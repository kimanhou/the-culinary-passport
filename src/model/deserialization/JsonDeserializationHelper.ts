import { LatLngExpression } from "leaflet";
import { FieldType } from "./FieldType";

class JsonDeserializationHelper {
    assertFieldExists = (json: any, field: string) => {
        const rawValue = json[field];
        if (rawValue == null) {
            throw new Error(`Field ${field} did not exist.`);
        }
        return rawValue;
    };

    assertField = <IT, OT>(
        json: any,
        field: string,
        type: FieldType<IT, OT>
    ) => {
        this.assertFieldExists(json, field);
        const value = type.assertType(json[field]);
        return value;
    };

    assertFieldOrDefault = <IT, OT>(
        json: any,
        field: string,
        type: FieldType<IT, OT>,
        defaultValue: OT
    ) => {
        const value = this.assertOptionalField(json, field, type);
        if (value == null) {
            return defaultValue;
        }
        return value;
    };

    assertOptionalField = <IT, OT>(
        json: any,
        field: string,
        type: FieldType<IT, OT>
    ) => {
        let value = undefined;
        const rawValue = json[field];
        if (rawValue != null) {
            value = this.assertField(json, field, type);
        }
        return value;
    };

    assertOptionalNullField = <IT, OT>(
        json: any,
        field: string,
        type: FieldType<IT, OT>
    ) => {
        const optionalValue = this.assertOptionalField(json, field, type);
        return optionalValue != null ? optionalValue : null;
    };

    assertArray = <T>(json: any, field: string, handler: (json: any) => T) => {
        const array: T[] = [];
        const elements = json[field];
        if (elements == null) {
            return [];
        }
        if (!Array.isArray(elements)) {
            throw new Error(`Field ${field} is not an array.`);
        }
        for (const element of elements) {
            array.push(handler(element));
        }
        return array;
    };

    assertLatLngExpression = (value: any) => {
        if (!value) return value;
        if (!Array.isArray(value)) {
            throw Error("Expected mapCenter to be an array");
        }
        if ((value as any[]).length < 2) {
            throw Error("Expected mapCenter to contain at least two numbers");
        }
        if ((value as any[]).length > 3) {
            throw Error("Expected mapCenter to contain at most three numbers");
        }
        if ((value as any[]).find((x) => typeof x !== "number") != null) {
            throw Error("Expected mapCenter to contain only numbers");
        }
        return value as LatLngExpression;
    };
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new JsonDeserializationHelper();
