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

interface IGeneratedInputOptional<T = any> {
    element: 'input' | 'select' | 'file';
    value: T;
    type: 'text' | 'number' | 'password' | 'email' | 'file';
    placeholder: string;
    label: string;
    min: number;
    max: number;
    validationlabel: string;
    noValidate: boolean;
    validationErrorStyle: 'validation-error--underline' | 'validation-error--tooltip';
    autoComplete: 'off' | 'on' | 'new-password';
    initialvalue: T;
    icon: string;
    touched: boolean;
    active: boolean;
    displayErrorMsg: boolean;
    avatar: string;
    options: any[];
    onFileUploadChange: ChangeEventHandler<HTMLInputElement>;
}

export interface IGeneratedInput<T = any> extends Partial<IGeneratedInputOptional<T>> {
    name: string;
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
