import React, { Component } from "react";
import { validate } from "../../utils/misc";

class Form extends Component {
    state = { data: {}, errors: {} };

    validate() {
        return validate(this.state.data);
    }

    displayError(touched, error, validationErrorClass = "validation-error--tooltip") {
        let markup = <small className={validationErrorClass}>{error}</small>;

        return touched && error && markup;
    }

    renderInput = (
        {
            element,
            config,
            validationErrorClass,
            noValidate,
            label,
            icon,
            touched,
            active,
            onFileUploadChange,
            displayErrorMsg = true,
            options = [],
            ...rest
        },
        error,
    ) => {
        switch (element) {
            case "input":
                return (
                    <div className={`field ${error ? "error" : ""} ${rest.value || active ? "active" : ""}`}>
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

            case "file":
                return (
                    <div className={`field ${!noValidate && error ? "error" : ""}`}>
                        {label && <label>{label}</label>}

                        {icon && <i className={`${icon}`}></i>}

                        <input
                            {...config}
                            {...rest}
                            onChange={e => this.onInputFileChange(e, onFileUploadChange)}
                            onBlur={this.onBlur}
                            onFocus={this.onFocus}
                        />

                        {!noValidate && displayErrorMsg && this.displayError(touched, error, validationErrorClass)}
                    </div>
                );

            default:
                return null;
        }
    };

    onInputFileChange = (e, onFileUploadChange) => {
        const { name, value } = e.currentTarget;

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

        onFileUploadChange(e);
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

        this.onFormChange && this.onFormChange({ name: value });
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
