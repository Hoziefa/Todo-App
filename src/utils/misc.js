export const validate = formValues =>
    Object.values(formValues).reduce((acc, { name, label, min, max, value, validationlabel, config: { type } }) => {
        let fieldName = validationlabel || label || name;

        if (typeof value === "string") value = value.trim();

        if (type === "number" && +value <= 0) acc[name] = `${fieldName} must be greater than or equal to 1`;

        if (type === "email" && !/\S+@\S+\.\S+/.test(value)) acc[name] = `must be a valid email`;

        if (value && (min || max) && (+value.length < min || +value.length > max)) {
            acc[name] = `${fieldName} field must be ${
                min && max
                    ? `between ${min} and ${max}`
                    : min && !max
                    ? `more than ${min}`
                    : max && !min
                    ? `less than ${max}`
                    : ""
            }`;
        }

        if (type === "password" && name === "password confirmation" && value !== formValues.password.value)
            acc[name] = "Your password and confirmation password do not match";

        if (!value) acc[name] = `${fieldName} field is required`;

        return acc;
    }, {});

export const generateInput = ({
    element = "input",
    name = "",
    type = "text",
    value = "",
    config,
    label = "",
    ...rest
}) => ({
    element,
    name,
    value,
    config: { type, ...config },
    label,
    ...rest,
});
