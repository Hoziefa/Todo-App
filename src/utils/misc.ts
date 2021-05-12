import { FieldsFactory, FieldTypes, IGeneratedFieldProps, InputTypes, IObjectHasComputedProps } from 'types';

export const validate = (fields: IObjectHasComputedProps): IObjectHasComputedProps =>
    Object.values(fields).reduce(
        (acc: IObjectHasComputedProps, { name, type, label, min, max, minLength, maxLength, value, validationlabel, noValidate }): IObjectHasComputedProps => {
            acc[name] = '';

            if (noValidate) return acc;

            const fieldName = validationlabel ?? label ?? name;
            const minValue = min ?? minLength;
            const maxValue = max ?? maxLength;

            if (typeof value === 'string') value = value.trim();

            if (type === 'number' && +value <= 0) acc[name] = `${ fieldName } must be greater than or equal to 1`;

            if (type === 'email' && !/\S+@\S+\.\S+/.test(value)) acc[name] = `must be a valid email`;

            if (value && (minValue || maxValue) && (+value.length < minValue || +value.length > maxValue)) {
                acc[name] = `${ fieldName } field must be ${
                    minValue && maxValue ? `between ${ minValue } and ${ maxValue }` : minValue && !maxValue ? `more than ${ minValue }` : maxValue && !minValue ? `less than ${ maxValue }` : ''
                }`;
            }

            if (type === 'password' && name === 'password confirmation' && value !== fields.password.value) acc[name] = 'Your password and password confirmation do not match';

            if (!value) acc[name] = `${ fieldName } field is required`;

            return acc;
        },

        {},
    );

export const fieldsFactory: FieldsFactory = ({ element = FieldTypes.Input, value = '', type = InputTypes.Text, ...rest }): IGeneratedFieldProps<any> => ({ element, value, type, ...rest });
