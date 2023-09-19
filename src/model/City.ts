import { FieldType } from "./deserialization/FieldType";
import JsonDeserializationHelper from "./deserialization/JsonDeserializationHelper";

export default class City {
    name: string;
    file: string;

    constructor(name: string, file: string) {
        this.name = name;
        this.file = file;
    }

    static deserialize = (data: any) => {
        const name = JsonDeserializationHelper.assertField(
            data,
            "name",
            FieldType.STRING
        );
        const file = JsonDeserializationHelper.assertFieldOrDefault(
            data,
            "file",
            FieldType.STRING,
            ""
        );

        return new City(name, file);
    };
}
