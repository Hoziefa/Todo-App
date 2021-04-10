import React, { ChangeEvent, ChangeEventHandler, Component } from 'react';
import DatePicker from 'react-datepicker';
import { Field } from './Field';
import { objectUtils, validate } from '../../utils';
import { IFieldConfig, IGeneratedFieldProps, IObjectHasComputedProps } from 'types';

interface IFormState {
    data: IObjectHasComputedProps<IGeneratedFieldProps>;
    errors: IObjectHasComputedProps<string>;
}

abstract class Form<P, S extends IFormState> extends Component<P, S> {
    public readonly abstract state = { data: {}, errors: {} } as Readonly<S>;

    protected abstract onFormSubmit(values: IObjectHasComputedProps): void;

    protected renderField = (props: IGeneratedFieldProps, error: string): JSX.Element | null => {
        const { active, value, options = [], name, noValidate, avatar, onFileUploadChange, touched, validationErrorStyle, dateFormat = 'P' } = props;

        const fieldConfig: IFieldConfig = objectUtils.pick(props, 'name', 'value', 'type', 'placeholder', 'min', 'max', 'autoComplete');

        const errorElement = this.displayError(touched, error, validationErrorStyle);

        const fieldComponentProps = { ...objectUtils.pick(props, 'label', 'icon', 'noValidate', 'displayError'), errorElement };

        switch (props.element) {
            case 'input':
                return (
                    <Field classAttr={ { error: !!error, active: !!value || active } } { ...fieldComponentProps }>
                        <input { ...fieldConfig } onChange={ this.onChange } onBlur={ this.onBlur } onFocus={ this.onFocus } />
                    </Field>
                );

            case 'select':
                return (
                    <Field classAttr={ { error: !!error } } { ...fieldComponentProps }>
                        <select { ...fieldConfig } onChange={ this.onChange }>
                            <option value="">Select One</option>

                            { options.map(({ id, name, key, value }, idx): JSX.Element => <option key={ id ?? key ?? idx } value={ id ?? key }>{ name ?? value }</option>) }
                        </select>
                    </Field>
                );

            case 'file':
                return (
                    <Field classAttr={ { error: !noValidate && !!error, active: !!value || active } } { ...fieldComponentProps }>
                        <div className="file-upload-container">
                            <div className={ `file-upload ${ avatar ? 'src-pr' : '' }` } style={ { background: avatar && `#eee url(${ avatar })` } }>
                                <input
                                    { ...fieldConfig }
                                    onChange={ (e): void => this.onInputFileChange(e, onFileUploadChange!) }
                                    onBlur={ this.onBlur }
                                    onFocus={ this.onFocus }
                                />
                            </div>
                        </div>
                    </Field>
                );

            case 'date':
                return (
                    <Field classAttr={ { error: !!error, active: !!value || active, defaultList: ['date--picker'] } } { ...fieldComponentProps }>
                        <DatePicker selected={ value } dateFormat={ dateFormat } showTimeSelect onChange={ (date: Date): void => this.handleFieldChange(name, date) } />
                    </Field>
                );

            default:
                return null;
        }
    };

    protected onsubmit = (e: ChangeEvent<HTMLFormElement>): void => {
        const { data } = this.state;

        e.preventDefault();

        const errors = this.validate();

        this.setState({ data: Object.entries(data).reduce((acc, [key, value]): IObjectHasComputedProps => ({ ...acc, [key]: { ...value, touched: true } }), {}), errors });

        if (objectUtils.hasAValidProp(errors)) return;

        this.onFormSubmit(objectUtils.mapFormValuesToKeyValuePairs(data));
    };

    protected onFormChange?(_values: IObjectHasComputedProps): void {}

    protected resetField(fieldName: keyof S['data'], fieldValue: string | Date | null = ''): IGeneratedFieldProps {
        return { ...this.state.data[fieldName], value: fieldValue, active: false, touched: false };
    }

    protected clearErrors(): S['errors'] {
        const { errors } = this.state;

        return { ...errors, ...objectUtils.mapRecordValues(errors, '') };
    }

    private displayError = (touched?: boolean, error?: string, validationErrorStyle = 'validation-error--tooltip'): false | JSX.Element => {
        const markup = <small className={ validationErrorStyle }>{ error }</small>;

        return !!touched && !!error && markup;
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

    private handleFieldChange(name: string, value: string | Date): void {
        this.setState(
            { data: { ...this.state.data, [name]: { ...this.state.data[name], value } } },
            (): void => {
                const { data, errors } = this.state;
                const newErrors = this.validate();

                if (!data[name].touched) return;

                this.setState({ errors: { ...errors, [name]: newErrors[name] } });
            },
        );
    }
}

export default Form;
