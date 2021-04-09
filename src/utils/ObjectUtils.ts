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
}

export const { objectUtils } = ObjectUtils;
