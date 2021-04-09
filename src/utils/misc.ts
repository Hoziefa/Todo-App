import { FieldsFactory, IGeneratedFieldProps, IObjectHasComputedProps } from 'types';

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

export const fieldsFactory: FieldsFactory = ({ element = 'input', value = '', type = 'text', ...rest }): IGeneratedFieldProps => ({ element, value, type, ...rest });

// export const fieldsFactory: <T = any>(inputProps: IGeneratedFieldProps<T>) => IGeneratedFieldProps<T | string> = ({
//     element = 'input',
//     config: { value = '', type = 'text', ...configRest },
//     ...rest
// }): IGeneratedFieldProps => ({ config: { value, type, ...configRest }, element, ...rest });
