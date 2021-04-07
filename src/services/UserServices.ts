import md5 from 'md5';
import { CurrentUserFromService, firebaseService, IAuthService } from './FirebaseService';
import { CurrentUser, ICurrentUserProfile, ILoginRegister } from 'types';

type AuthResponse = { success: boolean; message: string; user: CurrentUser };

const usersRef = firebaseService.databaseRef('users');

class Auth {
    private static instance: Auth;

    private constructor(private authService: IAuthService) {}

    public static auth(authService: IAuthService): Auth {
        !Auth.instance && (Auth.instance = new Auth(authService));

        return Auth.instance;
    }

    public get currentUser(): CurrentUserFromService {
        return this.authService.currentUser;
    }

    public async loginUser({ email, password }: ILoginRegister): Promise<AuthResponse> {
        try {
            return await this.authService.signInWithEmailAndPassword(email, password).then(({ user }): AuthResponse => ({ success: true, message: 'registered successfully', user }));
        }
        catch ({ message }) {
            return { success: false, message: message.includes('password') ? 'Password or Email is wrong!' : 'User is not registered', user: null };
        }
    }

    public async logoutUser(): Promise<void> {
        try {
            await this.authService.signOut();
        }
        catch ({ message }) {
            console.error(message);
        }
    }

    public async registerUser({ email, password, username }: ILoginRegister): Promise<AuthResponse> {
        try {
            const user = await this.authService.createUserWithEmailAndPassword(email, password).then(async ({ user }): Promise<CurrentUser> => {
                await user!.updateProfile({ displayName: username, photoURL: `https://www.gravatar.com/avatar/${ md5(email) }?d=mp` });

                await usersRef.child(user!.uid).set({ username: user!.displayName, avatar: user!.photoURL, email });

                return user;
            });

            return { success: true, message: 'registered successfully', user };
        }
        catch ({ message }) {
            return { success: false, message, user: null };
        }
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

        return await usersRef.child(this.authService.currentUser.uid).once('value').then((snap): ICurrentUserProfile => ({ id: snap.key, ...snap.val() }));
    }

    public async changeCurrentUserAvatar(data: { blob: Blob; metadata: any }, storageDir: string): Promise<string | null> {
        if (!this.authService.currentUser.uid) return null;

        const newAvatar: string = await firebaseService.storageRef(storageDir).put(data.blob, data.metadata).then((snap): Promise<string> => snap.ref.getDownloadURL());

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
