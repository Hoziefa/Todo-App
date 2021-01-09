import firebase from "../services/firebase";

class UserService {
    usersRef = firebase.database().ref("users");

    async registerUser({ email, password, username }) {
        try {
            const user = await firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(({ user }) => user);

            await user.updateProfile({ displayName: username });

            return user;
        } catch ({ message }) {
            return { error: message };
        }
    }

    async loginUser({ email, password }) {
        try {
            return await firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(({ user }) => user);
        } catch ({ message }) {
            return { error: message.includes("password") ? "password or email is wrong!" : "user is not registered" };
        }
    }

    async logoutUser() {
        await firebase.auth().signOut();
    }

    get currentUser() {
        return firebase.auth().currentUser;
    }
}

const userService = new UserService();

export default userService;
