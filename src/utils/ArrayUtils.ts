import { TypeOfDataTypes } from '../types';
import { objectUtils } from './ObjectUtils';

class ArrayUtils {
    private static instance: ArrayUtils;

    private constructor() {}

    public static get arrayUtils(): ArrayUtils {
        !ArrayUtils.instance && (ArrayUtils.instance = new ArrayUtils());

        return ArrayUtils.instance;
    }

    public isEveryOfSameDataType(searchIn: Array<any>, datatype: TypeOfDataTypes): boolean {
        return searchIn.every((item): boolean => typeof item === datatype);
    }

    public isItemPresent<T>(searchIn: Array<T>, compareWith: any, key?: keyof T): boolean | null {
        if (this.isEveryOfSameDataType(searchIn, TypeOfDataTypes.StringType) && typeof compareWith === 'string') return searchIn.includes(compareWith as any);
        else if (this.isEveryOfSameDataType(searchIn, TypeOfDataTypes.ObjectType) && key) return searchIn.some((item: any): boolean => objectUtils.isValidIdentifier(item, key as string) && item[key] === compareWith);
        return null;
    }
}

export const { arrayUtils } = ArrayUtils;
