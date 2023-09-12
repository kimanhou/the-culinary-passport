import { FieldType } from "./FieldType";

class XmlDeserializationHelper{
    assertField = <IT, OT> (xml : Element, field : string, type : FieldType<IT, OT>) => {
        const elements = xml.getElementsByTagName(field);
        if(elements.length === 0){
            throw new Error(`Field ${field} did not exist.`);
        }
        const rawValue = elements[0].textContent;
        const value = type.assertType(rawValue);
        return value;
    }

    assertOptionalField = <IT, OT> (xml : Element, field : string, type : FieldType<IT, OT>) => {
        let value = undefined;
        const elements = xml.getElementsByTagName(field);
        if(elements.length > 0){
            value = this.assertField(xml, field, type);
        }
        return value;
    }

    assertArray = <T> (xml : Element, field : string, handler : (xml : Element) => T) => {
        const array : T[] = [];
        const elements = xml.getElementsByTagName(field);
        for(const element of elements){
            array.push(handler(element));
        }
        return array;
    }
}
export default new XmlDeserializationHelper();