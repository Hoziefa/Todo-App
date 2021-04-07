import { ChangeEvent, ChangeEventHandler, Component } from 'react';
import { validate } from '../../utils/misc';
import { IGeneratedInput, IObjectHasComputedProps } from 'types';

interface IFormProps {}

interface IFormState {
    data: IObjectHasComputedProps;
    errors: IObjectHasComputedProps;
}

abstract class Form<P, S extends IFormState> extends Component<IFormProps & P, IFormState & S> {
    public readonly state = { data: {}, errors: {} } as Readonly<IFormState & S>;

    private static displayError(touched?: boolean, error?: string, validationErrorStyle = 'validation-error--tooltip'): false | JSX.Element {
        const markup = <small className={ validationErrorStyle }>{ error }</small>;

        return !!touched && !!error && markup;
    }

    protected renderInput = (
        { element, label, icon, avatar, validationErrorStyle, noValidate, touched, active, displayErrorMsg = true, options = [], onFileUploadChange, ...rest }: IGeneratedInput,
        error: string): JSX.Element | null => {
        switch (element) {
            case 'input':
                return (
                    <div className={ `field ${ error ? 'error' : '' } ${ rest.value || active ? 'active' : '' }` }>
                        { label && <label>{ label }</label> }

                        { icon && <i className={ `${ icon }` } /> }

                        <input { ...rest } onChange={ this.onChange } onBlur={ this.onBlur } onFocus={ this.onFocus } />

                        { !noValidate && Form.displayError(touched, error, validationErrorStyle) }
                    </div>
                );

            case 'select':
                return (
                    <div className={ `field ${ error ? 'error' : '' }` }>
                        { label && <label>{ label }</label> }

                        <select { ...rest } onChange={ this.onChange }>
                            <option value="">Select One</option>

                            { options.map(({ id, name, key, value }, idx): JSX.Element => <option key={ id ?? key ?? idx } value={ id ?? key }>{ name ?? value }</option>) }
                        </select>

                        { !noValidate && Form.displayError(touched, error, validationErrorStyle) }
                    </div>
                );

            case 'file':
                return (
                    <div className={ `field ${ !noValidate && error ? 'error' : '' }` }>
                        { label && <label>{ label }</label> }

                        { icon && <i className={ `${ icon }` } /> }

                        <div className="file-upload-container">
                            <div
                                className={ `file-upload ${ avatar ? 'src-pr' : '' }` }
                                style={ { background: avatar && `#eee url(${ avatar })` } }>
                                <input
                                    { ...rest }
                                    onChange={ (e): void => this.onInputFileChange(e, onFileUploadChange!) }
                                    onBlur={ this.onBlur }
                                    onFocus={ this.onFocus }
                                />
                            </div>
                        </div>

                        { !noValidate && displayErrorMsg && Form.displayError(touched, error, validationErrorStyle) }
                    </div>
                );

            default:
                return null;
        }
    };

    protected onsubmit = (e: ChangeEvent<HTMLFormElement>): void => {
        e.preventDefault();

        const errors = this.validate();

        this.setState({ data: Object.entries(this.state.data).reduce((acc, [key, value]): IObjectHasComputedProps => ({ ...acc, [key]: { ...value, touched: true } }), {}), errors });

        if (Object.keys(errors).length) return;

        this.onFormSubmit(Object.values(this.state.data).reduce((acc, { name, value }): IObjectHasComputedProps => ({ ...acc, [name]: value }), {}));
    };

    private validate(): IObjectHasComputedProps {
        return validate(this.state.data);
    }

    private onInputFileChange = (e: ChangeEvent<HTMLInputElement>, onFileUploadChange: ChangeEventHandler<HTMLInputElement>): void => {
        const { name, value } = e.currentTarget;

        this.handleFieldChange(name, value);

        onFileUploadChange(e);
    };

    private onChange = ({ currentTarget: { name, value } }: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        this.handleFieldChange(name, value);

        this.onFormChange && this.onFormChange({ name: value });
    };

    private onBlur = ({ currentTarget: { name, value } }: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const errors = this.validate();

        this.setState({
            data: { ...this.state.data, [name]: { ...this.state.data[name], touched: true, active: !!value } },
            errors: { ...this.state.errors, [name]: errors[name] },
        });
    };

    private onFocus = ({ currentTarget: { name } }: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        this.setState({ data: { ...this.state.data, [name]: { ...this.state.data[name], active: true } } });
    };

    private handleFieldChange(name: string, value: string): void {
        this.setState(
            { data: { ...this.state.data, [name]: { ...this.state.data[name], value } } },
            (): void => {
                const errors = this.validate();

                this.setState({ errors: this.state.data[name].touched ? { ...this.state.errors, [name]: errors[name] } : this.state.errors });
            },
        );
    }

    protected onFormChange(_values: IObjectHasComputedProps): void {}

    protected abstract onFormSubmit(values: IObjectHasComputedProps): void;
}

export default Form;
