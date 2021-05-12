import { ChangeEventHandler } from 'react';
import { AcceptedFileUploadTypes, DateFormatTypes, FieldAutoCompleteValues, FieldTypes, InputTypes, ValidationErrorStyle } from './enums';

export interface IDataPersister {
    persistData<T>(key: string, data: T): void;
    deleteData(key: string): void;
    readData<T>(key: string): T | null;
    clearData(): void;
}

export interface ITodo {
    id?: string;
    task: string;
    date: number;
    createdAt: object;
    completed: boolean;
}

export interface IObjectHasComputedProps<T = any> {
    [key: string]: T;
}

export interface ILoginRegister {
    email: string;
    password: string;
    username?: string;
}

export interface ICurrentUserProfile {
    username: string;
    avatar: string;
    email?: string;
}

interface IGeneratedFieldOptionalProps<T> {
    element: FieldTypes;
    value: T;
    type: InputTypes;
    placeholder: string;
    label: string;
    min: number;
    max: number;
    minLength: number;
    maxLength: number;
    validationlabel: string;
    noValidate: boolean;
    validationErrorStyle: ValidationErrorStyle;
    autoComplete: FieldAutoCompleteValues;
    icon: string;
    touched: boolean;
    active: boolean;
    avatar: string;
    options: Array<T>;
    accept: AcceptedFileUploadTypes;
    displayError: boolean;
    dateFormat: DateFormatTypes;
    onFileUploadChange: ChangeEventHandler<HTMLInputElement>;
}

export interface IGeneratedFieldProps<T> extends Partial<IGeneratedFieldOptionalProps<T>> {
    name: string;
}

export interface IFieldConfig extends Pick<IGeneratedFieldProps<string>, 'name' | 'value' | 'type' | 'placeholder' | 'min' | 'max' | 'autoComplete' | 'accept'> {}
