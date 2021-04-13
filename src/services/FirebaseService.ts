import firebase from 'firebase/app';
import 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

export interface IAuthService {
    currentUser: firebase.User;
    createUserWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential>;
    signInWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential>;
    signOut(): Promise<void>;
}

export type CurrentUserFromService = firebase.User;

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

class FirebaseService implements IAuthService {
    private static instance: FirebaseService;

    public readonly firebase = firebase;

    private constructor() {}

    public static get firebaseService(): FirebaseService {
        !FirebaseService.instance && (FirebaseService.instance = new FirebaseService());

        return FirebaseService.instance;
    }

    public get currentUser(): firebase.User {
        return this.firebase.auth().currentUser! ?? {};
    }

    public storageRef = (path: string): firebase.storage.Reference => firebase.storage().ref(path);

    public databaseRef = (path: string): firebase.database.Reference => firebase.database().ref(path);

    public firebaseLooper = <T>(data: object): Array<T> => Object.entries(data ?? []).map(([id, value]): T => ({ id, ...value }));

    public createUserWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential> {
        return this.firebase.auth().createUserWithEmailAndPassword(email, password);
    }

    public signInWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential> {
        return this.firebase.auth().signInWithEmailAndPassword(email, password);
    }

    public signOut(): Promise<void> {
        return firebaseService.firebase.auth().signOut();
    }
}

export const { firebaseService } = FirebaseService;
