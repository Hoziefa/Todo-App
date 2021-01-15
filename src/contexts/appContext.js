import React, { Component } from "react";

const AppContext = React.createContext({});

export class AppContextProvider extends Component {
    state = {
        currentUser: this.props.currentUser,
        currentUserProfile: null,
        todos: [],
        filterDescription: window.localStorage.getItem("filterDescription") || "",
        filterDate: new Date(window.localStorage.getItem("filterDate") || Date.now()),
        modal: false,
    };

    updateAppContext = props => this.setState(props);

    componentDidUpdate(prevProps, prevState) {
        if (this.props.currentUser && !this.state.currentUser) this.setState({ currentUser: this.props.currentUser });
    }

    render() {
        return (
            <AppContext.Provider value={{ ...this.state, updateAppContext: this.updateAppContext }}>
                {this.props.children}
            </AppContext.Provider>
        );
    }
}

export default AppContext;
