import React from 'react';
import { BrowserRouter, Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';

import { AppContextProvider } from '../contexts/appContext';

import ScrollToTop from './common/ScrollToTop';
import PageLoader from './common/PageLoader';
import NotFound from './common/NotFound';
import NavBar from './common/NavBar';

import Home from './home';
import Todos from './todos/Todos';
import Register from './auth/Register';
import Login from './auth/Login';
import { CurrentUser } from 'types';

const App: React.FC<{ currentUser: CurrentUser }> = ({ currentUser }): JSX.Element => {
    return (
        <AppContextProvider currentUser={ currentUser }>
            <BrowserRouter>
                <ScrollToTop />

                <PageLoader />

                <NavBar currentUser={ currentUser } />

                <Switch>
                    <Route
                        exact
                        path="/register"
                        component={ (props: RouteComponentProps): JSX.Element => !currentUser ? <Register { ...props } /> : <Redirect to="/" /> }
                    />

                    <Route
                        exact
                        path="/login"
                        component={ (props: RouteComponentProps): JSX.Element => !currentUser ? <Login { ...props } /> : <Redirect to="/" /> }
                    />

                    <Route
                        exact
                        path="/"
                        component={ (props: RouteComponentProps): JSX.Element => currentUser ? <Home { ...props } /> : <Redirect to="/login" /> }
                    />

                    <Route
                        exact
                        path="/todos"
                        component={ (props: RouteComponentProps): JSX.Element => currentUser ? <Todos { ...props } /> : <Redirect to="/login" /> }
                    />

                    <Route exact path="/notfound" component={ NotFound } />

                    <Redirect to="/notfound" />
                </Switch>
            </BrowserRouter>
        </AppContextProvider>
    );
};

export default App;
