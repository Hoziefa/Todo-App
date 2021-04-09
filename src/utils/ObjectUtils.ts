import { IObjectHasComputedProps } from '../types';

class ObjectUtils {
    private static instance: ObjectUtils;

    private constructor() {}

    public static get objectUtils(): ObjectUtils {
        !ObjectUtils.instance && (ObjectUtils.instance = new ObjectUtils());

        return ObjectUtils.instance;
    }

    public isValidIdentifier(checkin: object, identifier: string): boolean {
        return checkin.hasOwnProperty(identifier);
    }

    //ToDo: Correct type on accumulator.
    public pick<T extends object, R extends keyof T>(pickFrom: T, ...keys: Array<keyof T>): Pick<T, R> {
        return keys.reduce((acc: any, key): any => {

            if (this.isValidIdentifier(pickFrom, key as string)) acc[key] = pickFrom[key];

            return acc;
        }, {});
    }

    public extractClassesAttrs(classAttr: object): string {
        return Object.entries(classAttr ?? {}).reduce((acc: Array<string>, [className, show]): Array<string> => show ? [...acc, className] : acc, []).join(' ');
    }

    public mapRecordValues<T>(record: object, newValue: T): IObjectHasComputedProps<T> {
        return Object.keys(record).reduce((acc, key): IObjectHasComputedProps<T> => ({ ...acc, [key]: newValue }), {});
    }

    public mapFormValuesToKeyValuePairs<T>(formValues: object): IObjectHasComputedProps<T> {
        return Object.values(formValues).reduce((acc, { name, value }): IObjectHasComputedProps<T> => ({ ...acc, [name]: value }), {});
    }
}

export const { objectUtils } = ObjectUtils;
