import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

import firebase from "./services/firebaseService";  

import { AppContextProvider } from "./contexts/appContext";

import "react-datepicker/dist/react-datepicker.css";
import "react-calendar/dist/Calendar.css";

import "./assets/css/style.scss";

firebase.auth().onAuthStateChanged(currentUser => {
    ReactDOM.render(
        <AppContextProvider currentUser={currentUser}>
            <App currentUser={currentUser} />
        </AppContextProvider>,

        document.getElementById("root"),
    );
});
