import React, { Component } from "react";
import joi from "joi-browser";
import { validate } from "../../utils/misc";

class Form extends Component {
    state = { data: {}, errors: {} };

    validate() {
        // const data = Object.entries(this.state.data).reduce((acc, [key, { value }]) => ({ ...acc, [key]: value }), {});
        // const { error } = joi.validate(data, this.schema, { abortEarly: false });
        // if (!error) return;
        // return error.details.reduce(
        //     (acc, { context, message }) => (!acc[context.key] ? { ...acc, [context.key]: message } : acc),
        //     {},
        // );

        return validate(this.state.data);
    }

    displayError(touched, error, validationErrorClass = "validation-error--tooltip") {
        let markup = <small className={validationErrorClass}>{error}</small>;

        return touched && error && markup;
    }

    renderInput = (
        { element, config, validationErrorClass, noValidate, label, icon, touched, active, options = [], ...rest },
        error,
    ) => {
        switch (element) {
            case "input":
                return (
                    <div className={`field ${error ? "error" : ""} ${active ? "active" : ""}`}>
                        {label && <label>{label}</label>}

                        {icon && <i className={`${icon}`}></i>}

                        <input
                            {...config}
                            {...rest}
                            onChange={this.onChange}
                            onBlur={this.onBlur}
                            onFocus={this.onFocus}
                        />

                        {!noValidate && this.displayError(touched, error, validationErrorClass)}
                    </div>
                );

            case "select":
                return (
                    <div className={`field ${error ? "error" : ""}`}>
                        {label && <label>{label}</label>}

                        <select {...config} {...rest} onChange={this.onChange}>
                            <option value="">Select One</option>

                            {options.map(({ _id, name, key, value }, idx) => (
                                <option key={idx} value={_id || key}>
                                    {name || value}
                                </option>
                            ))}
                        </select>

                        {!noValidate && this.displayError(touched, error, validationErrorClass)}
                    </div>
                );

            default:
                return null;
        }
    };

    onChange = ({ currentTarget: { name, value } }) => {
        this.setState(
            {
                data: { ...this.state.data, [name]: { ...this.state.data[name], value } },
            },
            () => {
                const errors = this.validate();

                this.setState({
                    errors: this.state.data[name].touched
                        ? { ...this.state.errors, [name]: errors[name] }
                        : this.state.errors,
                });
            },
        );
    };

    onBlur = ({ currentTarget: { name, value } }) => {
        const errors = this.validate();

        this.setState({
            data: { ...this.state.data, [name]: { ...this.state.data[name], touched: true, active: !!value } },
            errors: { ...this.state.errors, [name]: errors[name] },
        });
    };

    onFocus = ({ currentTarget: { name } }) => {
        this.setState({
            data: { ...this.state.data, [name]: { ...this.state.data[name], active: true } },
        });
    };

    onsubmit = e => {
        e.preventDefault();

        const errors = this.validate();

        this.setState({
            data: Object.entries(this.state.data).reduce(
                (acc, [key, value]) => ({ ...acc, [key]: { ...value, touched: true } }),
                {},
            ),
            errors,
        });

        if (Object.keys(errors).length) return;

        this.onFormSubmit(
            Object.values(this.state.data).reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {}),
        );
    };
}

export default Form;
