import React, { Component, ReactNode } from 'react';
import { dataPersister, dateService } from '../services';
import { CurrentUser, DataPersistKeys, ICurrentUserProfile, ITodo, PartialRequired } from 'types';

interface IAppContextProviderProps {
    currentUser: CurrentUser;
}

interface IAppContextProviderState {
    currentUser: CurrentUser;
    currentUserProfile: ICurrentUserProfile | null;
    todos: Array<ITodo>;
    filterDescription: string;
    filterDate: Date;
    modal: boolean;
}

type UpdateAppContext = { updateAppContext(props: PartialRequired<IAppContextProviderState>): void };

type TAppContext = IAppContextProviderState & UpdateAppContext;

export const AppContext = React.createContext<TAppContext>({} as TAppContext);

export class AppContextProvider extends Component<IAppContextProviderProps, IAppContextProviderState> {
    public readonly state: Readonly<IAppContextProviderState> = {
        currentUser: this.props.currentUser,
        currentUserProfile: null,
        todos: [],
        filterDescription: dataPersister.readData<string>(DataPersistKeys.DescriptionFilterKey) ?? '',
        filterDate: dateService.toDate(dataPersister.readData<string>(DataPersistKeys.DateFilterKey) ?? Date.now()),
        modal: false,
    };

    public render(): ReactNode {
        return (
            <AppContext.Provider value={ { ...this.state, updateAppContext: this.updateAppContext } }>
                { this.props.children }
            </AppContext.Provider>
        );
    }

    public componentDidUpdate(): void {
        this.props.currentUser && !this.state.currentUser && this.setState({ currentUser: this.props.currentUser });
    }

    public updateAppContext = (props: IAppContextProviderProps): void => this.setState(props);
}
