import ReactDOM from 'react-dom';
import App from './components/App';

import { firebaseService } from './services/FirebaseService';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-calendar/dist/Calendar.css';

import './assets/styles/main.scss';

firebaseService.firebase.auth().onAuthStateChanged(currentUser => {
    ReactDOM.render(<App currentUser={currentUser} />, document.getElementById('root'));
});
