// import md5 from 'md5';
// import { firebaseService } from './FirebaseService';
// import { CurrentUser, ICurrentUserProfile, ILoginRegister } from 'types';

// namespace UserServices {
//     const usersRef = firebaseService.firebase.database().ref('users');

//     class Auth {
//         private static instance: Auth;

//         public static get auth(): Auth {
//             !Auth.instance && (Auth.instance = new Auth());

//             return Auth.instance;
//         }

//         private constructor() {}

//         public async registerUser({
//             email,
//             password,
//             username,
//         }: ILoginRegister): Promise<{ success: boolean; message: any; user: CurrentUser | null }> {
//             try {
//                 const user = await firebaseService.firebase
//                     .auth()
//                     .createUserWithEmailAndPassword(email, password)
//                     .then(async ({ user }) => {
//                         await user!.updateProfile({
//                             displayName: username,
//                             photoURL: `https://www.gravatar.com/avatar/${md5(email)}?d=mp`,
//                         });

//                         await usersRef
//                             .child(user!.uid)
//                             .set({ username: user!.displayName, avatar: user!.photoURL, email });

//                         return user;
//                     });

//                 return { success: true, message: 'registered successfully', user };
//             } catch ({ message }) {
//                 return { success: false, message, user: null };
//             }
//         }

//         public async loginUser({ email, password }: ILoginRegister) {
//             try {
//                 return await firebaseService.firebase
//                     .auth()
//                     .signInWithEmailAndPassword(email, password)
//                     .then(({ user }) => ({ success: true, message: 'registered successfully', user }));
//             } catch ({ message }) {
//                 return {
//                     success: false,
//                     message: message.includes('password') ? 'password or email is wrong!' : 'user is not registered',
//                     user: null,
//                 };
//             }
//         }

//         public async logoutUser(): Promise<void> {
//             try {
//                 await firebaseService.firebase.auth().signOut();
//             } catch ({ message }) {
//                 console.error(message);
//             }
//         }

//         public get currentUser() {
//             return firebaseService.firebase.auth().currentUser ?? ({} as firebase.default.User);
//         }
//     }

//     class Profile {
//         private static instance: Profile;

//         public static get profile(): Profile {
//             !Profile.instance && (Profile.instance = new Profile());

//             return Profile.instance;
//         }

//         private constructor() {}

//         public async getCurrentUserProfile(): Promise<null | ICurrentUserProfile> {
//             if (!auth.currentUser.uid) return null;

//             return await usersRef
//                 .child(auth.currentUser.uid)
//                 .once('value')
//                 .then(snap => ({ id: snap.key, ...snap.val() }));
//         }

//         public async changeCurrentUserAvatar(
//             data: { blob: Blob; metadata: any },
//             storageDir: string,
//         ): Promise<string | null> {
//             if (!auth.currentUser.uid) return null;

//             const newAvatar: string = await firebaseService
//                 .storageRef(storageDir)
//                 .put(data.blob, data.metadata)
//                 .then(snap => snap.ref.getDownloadURL());

//             await auth.currentUser.updateProfile({ photoURL: newAvatar });

//             await usersRef.child(auth.currentUser.uid).update({ avatar: newAvatar });

//             return newAvatar;
//         }

//         public async changeCurrentUserProfile(username: string): Promise<void> {
//             if (!auth.currentUser.uid) return;

//             await auth.currentUser.updateProfile({ displayName: username });

//             await usersRef.child(auth.currentUser.uid).update({ username });
//         }
//     }

//     export const { auth } = Auth;
//     export const { profile } = Profile;
// }

// export const userServices = UserServices;

import md5 from 'md5';
import { firebaseService, IAuthService } from './FirebaseService';
import { CurrentUser, ICurrentUserProfile, ILoginRegister } from 'types';

type AuthResponse = { success: boolean; message: string; user: CurrentUser | null };

const usersRef = firebaseService.databaseRef('users');

class Auth {
    private static instance: Auth;

    private constructor(private authService: IAuthService) {}

    public static auth(authService: IAuthService): Auth {
        !Auth.instance && (Auth.instance = new Auth(authService));

        return Auth.instance;
    }

    public async registerUser({ email, password, username }: ILoginRegister): Promise<AuthResponse> {
        try {
            const user = await this.authService.createUserWithEmailAndPassword(email, password).then(async ({ user }) => {
                await user!.updateProfile({
                    displayName: username,
                    photoURL: `https://www.gravatar.com/avatar/${md5(email)}?d=mp`,
                });

                await usersRef.child(user!.uid).set({ username: user!.displayName, avatar: user!.photoURL, email });

                return user;
            });

            return { success: true, message: 'registered successfully', user };
        } catch ({ message }) {
            return { success: false, message, user: null };
        }
    }

    public async loginUser({ email, password }: ILoginRegister): Promise<AuthResponse> {
        try {
            return await this.authService
                .signInWithEmailAndPassword(email, password)
                .then(({ user }) => ({ success: true, message: 'registered successfully', user }));
        } catch ({ message }) {
            return {
                success: false,
                message: message.includes('password') ? 'Password or Email is wrong!' : 'User is not registered',
                user: null,
            };
        }
    }

    public async logoutUser(): Promise<void> {
        try {
            await this.authService.signOut();
        } catch ({ message }) {
            console.error(message);
        }
    }

    public get currentUser() {
        return this.authService.currentUser;
    }
}

class Profile {
    private static instance: Profile;

    private constructor(private authService: IAuthService) {}

    public static profile(authService: IAuthService): Profile {
        !Profile.instance && (Profile.instance = new Profile(authService));

        return Profile.instance;
    }

    public async getCurrentUserProfile(): Promise<null | ICurrentUserProfile> {
        if (!this.authService.currentUser.uid) return null;

        return await usersRef
            .child(this.authService.currentUser.uid)
            .once('value')
            .then(snap => ({ id: snap.key, ...snap.val() }));
    }

    public async changeCurrentUserAvatar(data: { blob: Blob; metadata: any }, storageDir: string): Promise<string | null> {
        if (!this.authService.currentUser.uid) return null;

        const newAvatar: string = await firebaseService
            .storageRef(storageDir)
            .put(data.blob, data.metadata)
            .then(snap => snap.ref.getDownloadURL());

        await this.authService.currentUser.updateProfile({ photoURL: newAvatar });

        await usersRef.child(this.authService.currentUser.uid).update({ avatar: newAvatar });

        return newAvatar;
    }

    public async changeCurrentUserProfile(username: string): Promise<void> {
        if (!this.authService.currentUser.uid) return;

        await this.authService.currentUser.updateProfile({ displayName: username });

        await usersRef.child(this.authService.currentUser.uid).update({ username });
    }
}

class UserServices {
    private static instance: UserServices;
    public readonly auth = Auth.auth(firebaseService);
    public readonly profile = Profile.profile(firebaseService);

    private constructor() {}

    public static get userServices(): UserServices {
        !UserServices.instance && (UserServices.instance = new UserServices());

        return UserServices.instance;
    }
}

export const { userServices } = UserServices;
