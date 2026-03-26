import {
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    UserCredential,
} from 'firebase/auth';
import {auth} from '../config/firebase';

export const loginWithEmail = async (
    email: string,
    password: string
): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmail = async (
    email: string,
    password: string
): Promise<UserCredential> => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async (): Promise<void> => {
    await signOut(auth);
};