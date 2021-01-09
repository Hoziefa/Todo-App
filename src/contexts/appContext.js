import React, { Component } from "react";

const AppContext = React.createContext({});

export class AppContextProvider extends Component {
    state = { currentUser: this.props.currentUser, todos: [] };

    updateAppContext = prop => this.setState({ [prop.key]: prop.value });

    render() {
        return (
            <AppContext.Provider value={{ ...this.state, updateAppContext: this.updateAppContext }}>
                {this.props.children}
            </AppContext.Provider>
        );
    }
}

export default AppContext;
