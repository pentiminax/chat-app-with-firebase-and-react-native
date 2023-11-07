import { User } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import firebase from '../firebase/firebase';

type ContextState = { user: User | null };

export const AuthContext = createContext<ContextState>({ user: null });

export function AuthProvider({ children }) {
    const [user, setUser] = useState<User | null>(null);

    const value = { user };

    useEffect(() => {
        const unsubscribe = firebase.auth.onAuthStateChanged(setUser);

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}