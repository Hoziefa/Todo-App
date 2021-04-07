import { IDataPersister } from 'types';

class DataPersister implements IDataPersister {
    private static instance: DataPersister;

    private constructor() {}

    public static get dataPersister(): DataPersister {
        !DataPersister.instance && (DataPersister.instance = new DataPersister());

        return DataPersister.instance;
    }

    public persistData<T>(key: string, data: T): void {
        window.localStorage.setItem(key, JSON.stringify(data));
    }

    public deleteData(key: string): void {
        window.localStorage.removeItem(key);
    }

    public readData<T>(key: string): T | null {
        return JSON.parse(window.localStorage.getItem(key) ?? 'null');
    }

    public clearData(): void {
        window.localStorage.clear();
    }
}

export const { dataPersister } = DataPersister;
