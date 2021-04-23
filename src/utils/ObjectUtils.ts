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

    public pick<T extends object, K extends keyof T>(pickFrom: T, ...keys: Array<K>): Pick<T, K> {
        return keys.reduce((acc: any, key): any => this.isValidIdentifier(pickFrom, key as string) ? { ...acc, [key]: pickFrom[key] } : acc, {});
    }

    public getEvaluatedClassAttr(classAttr: object): string {
        return Object.entries(classAttr ?? {}).reduce((acc: Array<string>, [className, show]): Array<string> => show ? [...acc, className] : acc, []).join(' ');
    }

    public mapRecordValues<T>(record: object, newValue: T): IObjectHasComputedProps<T> {
        return Object.keys(record).reduce((acc, key): IObjectHasComputedProps<T> => ({ ...acc, [key]: newValue }), {});
    }

    public mapFormValuesToKeyValuePairs<T>(formValues: object): IObjectHasComputedProps<T> {
        return Object.values(formValues).reduce((acc, { name, value }): IObjectHasComputedProps<T> => ({ ...acc, [name]: value }), {});
    }

    public hasAValidProp(validateOn: object): boolean {
        return Object.values(validateOn).some(Boolean);
    }
}

export const { objectUtils } = ObjectUtils;
