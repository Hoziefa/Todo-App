import firebase, { storageRef } from "../services/firebaseService";
import md5 from "md5";

class UserService {
    usersRef = firebase.database().ref("users");

    async registerUser({ email, password, username }) {
        try {
            const user = await firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(async ({ user }) => {
                    await user.updateProfile({
                        displayName: username,
                        photoURL: `https://www.gravatar.com/avatar/${md5(email)}?d=mp`,
                    });

                    await this.usersRef.child(user.uid).set({ username: user.displayName, avatar: user.photoURL, email });

                    return user;
                });

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
                message: message.includes("password") ? "password or email is wrong!" : "user is not registered",
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

    async getCurrentUserProfile() {
        if (!this.currentUser?.uid) return;

        return await this.usersRef
            .child(this.currentUser.uid)
            .once("value")
            .then(snap => ({ id: snap.key, ...snap.val() }));
    }

    async changeCurrentUserAvatar(data, storageDir) {
        if (!this.currentUser?.uid) return;

        const newAvatar = await storageRef(storageDir)
            .put(data.blob, data.metadata)
            .then(snap => snap.ref.getDownloadURL());

        await this.currentUser.updateProfile({ photoURL: newAvatar });

        await this.usersRef.child(this.currentUser.uid).update({ avatar: newAvatar });

        return newAvatar;
    }

    async changeCurrentUserProfile(username) {
        if (!this.currentUser?.uid) return;

        await this.currentUser.updateProfile({ displayName: username });

        await this.usersRef.child(this.currentUser.uid).update({ username });
    }

    get currentUser() {
        return firebase.auth().currentUser;
    }
}

const userService = new UserService();

export default userService;
