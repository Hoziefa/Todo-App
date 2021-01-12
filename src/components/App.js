import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import ScrollToTop from "./common/ScrollToTop";
import NotFound from "./common/NotFound";
import NavBar from "./common/NavBar";

import Home from "./home";
import Todos from "./todos";
import Register from "./auth/Register";
import Login from "./auth/Login";

const App = ({ currentUser }) => {
    // useEffect(() => (currentUser ? history.push("/") : history.push("/login")), [currentUser]);

    return (
        <BrowserRouter>
            <ScrollToTop />

            <NavBar currentUser={currentUser} />

            <Switch>
                <Route
                    exact
                    path="/register"
                    component={props => (!currentUser ? <Register {...props} /> : <Redirect to="/" />)}
                />

                <Route
                    exact
                    path="/login"
                    component={props => (!currentUser ? <Login {...props} /> : <Redirect to="/" />)}
                />

                <Route
                    exact
                    path="/"
                    component={props => (currentUser ? <Home {...props} /> : <Redirect to="/login" />)}
                />

                <Route
                    exact
                    path="/todos"
                    component={props => (currentUser ? <Todos {...props} /> : <Redirect to="/login" />)}
                />

                <Route exact path="/notfound" component={NotFound} />

                <Redirect to="/notfound" />
            </Switch>
        </BrowserRouter>
    );
};

export default App;
