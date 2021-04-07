import { IGeneratedInput, IObjectHasComputedProps } from 'types';

export const validate = (fields: IObjectHasComputedProps): IObjectHasComputedProps =>
    Object.values(fields).reduce(
        (acc: IObjectHasComputedProps, { name, type, label, min, max, value, validationlabel, noValidate }): IObjectHasComputedProps => {
            if (noValidate) return acc;

            const fieldName = validationlabel ?? label ?? name;

            if (typeof value === 'string') value = value.trim();

            if (type === 'number' && +value <= 0) acc[name] = `${ fieldName } must be greater than or equal to 1`;

            if (type === 'email' && !/\S+@\S+\.\S+/.test(value)) acc[name] = `must be a valid email`;

            if (value && (min || max) && (+value.length < min || +value.length > max)) {
                acc[name] = `${ fieldName } field must be ${
                    min && max ? `between ${ min } and ${ max }` : min && !max ? `more than ${ min }` : max && !min ? `less than ${ max }` : ''
                }`;
            }

            if (type === 'password' && name === 'password confirmation' && value !== fields.password.value) acc[name] = 'Your password and password confirmation do not match';

            if (!value) acc[name] = `${ fieldName } field is required`;

            return acc;
        },

        {},
    );

export const inputGenerator: <T = any>(inputProps: IGeneratedInput<T>) => IGeneratedInput<T | string> = ({
    element = 'input', name, value = '', type = 'text', label = '', ...rest
}): IGeneratedInput => ({ element, name, value, type, label, ...rest });
