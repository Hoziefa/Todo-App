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

interface IGeneratedInputOptional {
    element: 'input' | 'select' | 'file' | 'date';
    value: any;
    type: 'text' | 'number' | 'password' | 'email' | 'file' | 'date';
    placeholder: string;
    label: string;
    min: number;
    max: number;
    validationlabel: string;
    noValidate: boolean;
    validationErrorStyle: 'validation-error--underline' | 'validation-error--tooltip';
    autoComplete: 'off' | 'on' | 'new-password';
    initialvalue: any;
    icon: string;
    touched: boolean;
    active: boolean;
    avatar: string;
    options: any[];
    onFileUploadChange: ChangeEventHandler<HTMLInputElement>;
}

export interface IGeneratedInput extends Partial<IGeneratedInputOptional> {
    name: string;
}

export interface IFieldConfig extends Pick<IGeneratedInput, 'name' | 'value' | 'type' | 'placeholder' | 'min' | 'max' | 'autoComplete'> {}

//>: Extends multiple.
// export interface IGeneratedInput<T = any> extends Partial<IGeneratedInputOptional>, IFieldConfig<T> {}

// export interface IGeneratedInput<T = any> extends Partial<IGeneratedInputOptional> {
//     config: IFieldConfig<T>
// }
