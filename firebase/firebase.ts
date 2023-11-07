import { Auth, GoogleAuthProvider, User, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { CollectionReference, Firestore, Query, Timestamp, addDoc, collection, getFirestore, orderBy, query } from 'firebase/firestore';
import { ToastAndroid } from 'react-native';
import { IMessage } from "react-native-gifted-chat";

type Message = {
    id: string,
    createdAt: Timestamp,
    text: string,
    userUid: string
}

class FirebaseService {
    auth: Auth;
    firestore: Firestore;
    googleAuthProvider: GoogleAuthProvider;
    messagesCollection: CollectionReference<Message>;

    constructor() {
        const app = initializeApp({
            apiKey: "AIzaSyCC-vub_7yuzVzFD5PF8ztcQexjY2v9Uaw",
            authDomain: "pentiminax-messenger.firebaseapp.com",
            projectId: "pentiminax-messenger",
            storageBucket: "pentiminax-messenger.appspot.com",
            messagingSenderId: "164349630104",
            appId: "1:164349630104:web:745e17f262cae819c9a2ed"
        });

        this.auth = getAuth(app);
        this.firestore = getFirestore();
        this.googleAuthProvider = new GoogleAuthProvider();
        this.messagesCollection = collection(this.firestore, 'messages') as CollectionReference<Message>;
    }

    async addMessage(message: IMessage) {
        try {
            const { _id, createdAt, text, user } = message;

            await addDoc(this.messagesCollection, {
                id: _id as string,
                createdAt: createdAt as Date,
                text: text,
                userUid: user._id
            });
        } catch (error) {
            console.warn(error);
        }
    }

    async login(email: string, password: string): Promise<void> {
        let message = "";

        try {
            await signInWithEmailAndPassword(this.auth, email, password);
            message = "Connexion réussie";
        } catch (error) {
            if (error.code === 'auth/invalid-email') {
                message = "L'adresse e-mail est incorrect.";
            } else if (error.code === 'auth/invalid-login-credentials') {
                message = "Le mot de passe entré est incorrect.";
            }

        } finally {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        }
    }

    async logout(): Promise<void> {
        await signOut(this.auth);

        ToastAndroid.show("Déconnexion réussie", ToastAndroid.SHORT);
    }

    async register(email: string, password: string): Promise<void> {
        let message = "";

        try {
            await createUserWithEmailAndPassword(this.auth, email, password);
            message = "Inscription réussie";
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                message = "Cette adresse e-mail est déjà utilisé par un autre compte.";
            }
        } finally {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        }
    }
}

export default new FirebaseService();