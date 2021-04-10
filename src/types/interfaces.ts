import { ChangeEventHandler } from 'react';

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
    timestamp: object;
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
    element: 'input' | 'select' | 'file' | 'date';
    value: T;
    type: 'text' | 'number' | 'password' | 'email' | 'file' | 'date';
    placeholder: string;
    label: string;
    min: number;
    max: number;
    validationlabel: string;
    noValidate: boolean;
    validationErrorStyle: 'validation-error--underline' | 'validation-error--tooltip';
    autoComplete: 'off' | 'on' | 'new-password';
    icon: string;
    touched: boolean;
    active: boolean;
    avatar: string;
    options: any[];
    displayError: boolean;
    dateFormat: 'P' | 'p' | 'Pp';
    onFileUploadChange: ChangeEventHandler<HTMLInputElement>;
}

export interface IGeneratedFieldProps<T> extends Partial<IGeneratedFieldOptionalProps<T>> {
    name: string;
}

export interface IFieldConfig extends Pick<IGeneratedFieldProps<string>, 'name' | 'value' | 'type' | 'placeholder' | 'min' | 'max' | 'autoComplete'> {}
