export type FieldHandlerType<T> = (json : any) => T;

enum FieldTypeEnum{
    STRING = "STRING",
    NUMBER = "NUMBER",
    BOOLEAN = "BOOLEAN",
    DATE = "DATE",
    OBJECT = "OBJECT",
    ARRAY = "ARRAY",
    ENUM = "ENUM",
}

export class FieldType<IT, OT = IT>{
    value : FieldTypeEnum;
    handler ?: FieldHandlerType<IT>;

    constructor(value : FieldTypeEnum, handler ?: FieldHandlerType<IT>){
        this.value = value;
        this.handler = handler;
    }

    assertType = (json : any) => {
        switch(this.value){
            case FieldTypeEnum.STRING:
                json = this.castToString(json);
                break;
            case FieldTypeEnum.NUMBER:
                json = this.castToNumber(json);
                break;
            case FieldTypeEnum.BOOLEAN:
                json = this.castToBoolean(json);
                break;
            case FieldTypeEnum.DATE:
                json = this.castToDate(json);
                break;
            case FieldTypeEnum.OBJECT:
                json = this.castToObject(json);
                break;
            case FieldTypeEnum.ARRAY:
                json = this.castToArray(json);
                break;
            case FieldTypeEnum.ENUM:
                json = this.castToEnum(json);
                break;
        }
        return json as OT;
    }

    private castToString = (value : any) => {
        if(typeof value === 'string'){
            return value;
        }
        throw new Error(`${value} is not a string.`);
    }
    
    private castToNumber = (value : any) => {
        if(typeof value === 'string'){
            const floatValue = parseFloat(value);
            if(isNaN(floatValue)){
                throw new Error(`${value} is not a number.`)
            }
            return floatValue;
        }
        if(typeof value === 'number'){
            return value;
        }
        throw new Error(`${value} is not a number.`);
    }
    
    private castToBoolean = (value : any) => {
        if(typeof value === 'string'){
            if(value.toLowerCase() === "true"){
                return true;
            }
            if(value.toLowerCase() === "false"){
                return false;
            }
            throw new Error(`${value} is not a boolean.`);
        }
        if(typeof value === 'boolean'){
            return value;
        }
        throw new Error(`${value} is not a boolean.`);
    }
    
    private castToDate = (value : any) => {
        if(typeof value === 'string'){
            const numericDate = Date.parse(value);
            if(isNaN(numericDate)){
                throw new Error(`${value} is not a date.`)
            }
            return new Date(numericDate);
        }
        if(typeof value === 'object'){
            if(value instanceof Date){
                return value;
            }
        }
        throw new Error(`${value} is not a date.`);
    }
    
    private castToObject = (value : any) : IT => {
        if(typeof value === 'object' && this.handler != null){
            return this.handler(value);
        }
        throw new Error(`${value} is not an object.`);
    }
    
    private castToArray = (value : any) : IT[] => {
        if(typeof value === 'object' && this.handler != null
            && Array.isArray(value)){
            return value.map(x => this.handler!(x));
        }
        throw new Error(`${value} is not an array.`);
    }

    private castToEnum = (value : any) => {
        if(typeof value === 'string'
            && this.handler != null){
            return this.handler(value);
        }
        throw new Error(`${value} is not a string.`);
    }

    static STRING = new FieldType<string>(FieldTypeEnum.STRING);
    static NUMBER = new FieldType<number>(FieldTypeEnum.NUMBER);
    static BOOLEAN = new FieldType<boolean>(FieldTypeEnum.BOOLEAN);
    static DATE = new FieldType<Date>(FieldTypeEnum.DATE);
    static OBJECT = <T> (handler : FieldHandlerType<T>) => new FieldType<T>(FieldTypeEnum.OBJECT, handler);
    static ARRAY = <T> (handler : FieldHandlerType<T>) => new FieldType<T, T[]>(FieldTypeEnum.ARRAY, handler);
    static ENUM = <T> (handler : FieldHandlerType<T>) => new FieldType<T>(FieldTypeEnum.ENUM, handler);
}