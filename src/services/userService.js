import firebase from "../services/firebaseService";

class UserService {
    usersRef = firebase.database().ref("users");

    async registerUser({ email, password, username }) {
        try {
            const user = await firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(({ user }) => user);

            await user.updateProfile({ displayName: username });

            return { success: true, message: "registered successfully", user };
        } catch ({ message }) {
            return { success: false, message };
        }
    }

    async loginUser({ email, password }) {
        try {
            return await firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(({ user }) => ({ success: true, message: "registered successfully", user }));
        } catch ({ message }) {
            return {
                success: false,
                error: message.includes("password") ? "password or email is wrong!" : "user is not registered",
            };
        }
    }

    async logoutUser() {
        try {
            await firebase.auth().signOut();
        } catch (error) {
            console.error(error.message);
        }
    }

    get currentUser() {
        return firebase.auth().currentUser;
    }
}

const userService = new UserService();

export default userService;
