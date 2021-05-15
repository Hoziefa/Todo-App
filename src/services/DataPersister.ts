import { DataPersistKeys, IDataPersister } from 'types';

class DataPersister implements IDataPersister {
    private static instance: DataPersister;

    private constructor() {}

    public static get dataPersister(): DataPersister {
        !DataPersister.instance && (DataPersister.instance = new DataPersister());

        return DataPersister.instance;
    }

    public persistData<T>(key: DataPersistKeys, data: T): void {
        window.localStorage.setItem(key, JSON.stringify(data));
    }

    public deleteData(key: DataPersistKeys): void {
        window.localStorage.removeItem(key);
    }

    public readData<T>(key: DataPersistKeys): T | null {
        return JSON.parse(window.localStorage.getItem(key) ?? 'null');
    }

    public clearData(): void {
        window.localStorage.clear();
    }
}

export const { dataPersister } = DataPersister;
