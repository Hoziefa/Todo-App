import { ChangeEvent, ChangeEventHandler, Component } from 'react';
import { IGeneratedInput, IObjectHasComputedProps } from 'types';
import { validate } from '../../utils/misc';

interface IFormProps {}

interface IFormState {
    data: IObjectHasComputedProps;
    errors: IObjectHasComputedProps;
}

abstract class Form<P, S extends IFormState> extends Component<IFormProps & P, IFormState & S> {
    public readonly state: Readonly<IFormState & S> = { data: {}, errors: {} } as Readonly<IFormState & S>;

    private validate() {
        return validate(this.state.data);
    }

    private displayError(touched?: boolean, error?: string, validationErrorStyle = 'validation-error--tooltip') {
        let markup = <small className={validationErrorStyle}>{error}</small>;

        return touched && error && markup;
    }

    protected renderInput = (
        {
            element,
            label,
            icon,
            avatar,
            validationErrorStyle,
            noValidate,
            touched,
            active,
            displayErrorMsg = true,
            options = [],
            onFileUploadChange,
            ...rest
        }: IGeneratedInput,
        error: string,
    ) => {
        switch (element) {
            case 'input':
                return (
                    <div className={`field ${error ? 'error' : ''} ${rest.value || active ? 'active' : ''}`}>
                        {label && <label>{label}</label>}

                        {icon && <i className={`${icon}`}></i>}

                        <input {...rest} onChange={this.onChange} onBlur={this.onBlur} onFocus={this.onFocus} />

                        {!noValidate && this.displayError(touched, error, validationErrorStyle)}
                    </div>
                );

            case 'select':
                return (
                    <div className={`field ${error ? 'error' : ''}`}>
                        {label && <label>{label}</label>}

                        <select {...rest} onChange={this.onChange}>
                            <option value="">Select One</option>

                            {options.map(({ id, name, key, value }, idx) => (
                                <option key={id ?? key ?? idx} value={id ?? key}>
                                    {name ?? value}
                                </option>
                            ))}
                        </select>

                        {!noValidate && this.displayError(touched, error, validationErrorStyle)}
                    </div>
                );

            case 'file':
                return (
                    <div className={`field ${!noValidate && error ? 'error' : ''}`}>
                        {label && <label>{label}</label>}

                        {icon && <i className={`${icon}`}></i>}

                        <div className="file-upload-container">
                            <div
                                className={`file-upload ${avatar ? 'src-pr' : ''}`}
                                style={{ background: avatar && `#eee url(${avatar})` }}>
                                <input
                                    {...rest}
                                    onChange={e => this.onInputFileChange(e, onFileUploadChange!)}
                                    onBlur={this.onBlur}
                                    onFocus={this.onFocus}
                                />
                            </div>
                        </div>

                        {!noValidate && displayErrorMsg && this.displayError(touched, error, validationErrorStyle)}
                    </div>
                );

            default:
                return null;
        }
    };

    private onInputFileChange = (
        e: ChangeEvent<HTMLInputElement>,
        onFileUploadChange: ChangeEventHandler<HTMLInputElement>,
    ) => {
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

    private onChange = ({ currentTarget: { name, value } }: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    private onBlur = ({ currentTarget: { name, value } }: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const errors = this.validate();

        this.setState({
            data: { ...this.state.data, [name]: { ...this.state.data[name], touched: true, active: !!value } },
            errors: { ...this.state.errors, [name]: errors[name] },
        });
    };

    private onFocus = ({ currentTarget: { name } }: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        this.setState({
            data: { ...this.state.data, [name]: { ...this.state.data[name], active: true } },
        });
    };

    protected onsubmit = (e: ChangeEvent<HTMLFormElement>) => {
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

    protected onFormChange(values: IObjectHasComputedProps): void {}

    protected abstract onFormSubmit(values: IObjectHasComputedProps): void;
}

export default Form;
