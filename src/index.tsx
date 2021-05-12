import ReactDOM from 'react-dom';
import App from './components/App';

import { apiService } from './services';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-calendar/dist/Calendar.css';

import './assets/styles/main.scss';

apiService.firebase.auth().onAuthStateChanged((currentUser): void => {
    ReactDOM.render(<App currentUser={ currentUser } />, document.getElementById('root'));
});
