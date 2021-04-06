import React, { Component, ReactNode } from 'react';
import { dataPersister } from 'services/DataPersister';
import { EDataPersistKeys, CurrentUser, ICurrentUserProfile, ITodo, PartialRequired } from 'types';

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

//Note: To default with a value and have it excepted by TS use union with the default.
export const AppContext = React.createContext<TAppContext>({} as TAppContext);

export class AppContextProvider extends Component<IAppContextProviderProps, IAppContextProviderState> {
    public readonly state: Readonly<IAppContextProviderState> = {
        currentUser: this.props.currentUser,
        currentUserProfile: null,
        todos: [],
        filterDescription: dataPersister.readData<string>(EDataPersistKeys.DescriptionFilterKey) ?? '',
        filterDate: new Date(dataPersister.readData<Date>(EDataPersistKeys.DateFilterKey) ?? Date.now()),
        modal: false,
    };

    public updateAppContext = (props: IAppContextProviderProps): void => this.setState(props);

    public componentDidUpdate(): void {
        this.props.currentUser && !this.state.currentUser && this.setState({ currentUser: this.props.currentUser });
    }

    public render(): ReactNode {
        return (
            <AppContext.Provider value={{ ...this.state, updateAppContext: this.updateAppContext }}>
                {this.props.children}
            </AppContext.Provider>
        );
    }
}
