import firebase from "firebase/app";
import "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);

export const storageRef = path => firebase.storage().ref(path);

export const firebaseLooper = data => Object.entries(data || []).map(([id, value]) => ({ id, ...value }));

export const getImageDownloadURL = async (storageDir, image) =>
    await firebase.storage().ref(storageDir).child(image).getDownloadURL();

export default firebase;
