'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, signInAnonymously, onAuthStateChanged, linkWithPopup, GoogleAuthProvider, 
  AuthError, signInWithPopup, signInWithEmailAndPassword, linkWithCredential, EmailAuthProvider 
} from 'firebase/auth';
import { auth, isConfigured } from '../lib/firebase';
import { syncLocalDataToFirestore } from '../lib/storage';

const ADMIN_EMAIL = 'johnlemargonzales@gmail.com';

export function isAdmin(user: User | null): boolean {
  return user?.email === ADMIN_EMAIL && !user.isAnonymous;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  linkAccount: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  signUpWithEmail: (e: string, p: string) => Promise<void>;
  error: string | null;
  isDevMode: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  linkAccount: async () => {},
  loginWithGoogle: async () => {},
  loginWithEmail: async () => {},
  signUpWithEmail: async () => {},
  error: null,
  isDevMode: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
        await syncLocalDataToFirestore(currentUser.uid);
      } else {
        try {
          await signInAnonymously(auth!);
        } catch (err: any) {
          if (err?.code === 'auth/admin-restricted-operation') {
            console.warn("Anonymous sign-in is disabled in Firebase. Playing as local guest.");
          } else {
            console.error("Failed to sign in anonymously:", err);
          }
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const linkAccount = async () => {
    if (!auth?.currentUser) return;

    setError(null);
    const provider = new GoogleAuthProvider();

    try {
      await linkWithPopup(auth.currentUser, provider);
      await syncLocalDataToFirestore(auth.currentUser.uid);
    } catch (err) {
      const authError = err as AuthError;
      if (authError.code === 'auth/credential-already-in-use') {
        setError('This Google account is already linked to another Techdle profile. Please log out or use a different account.');
      } else {
        setError(authError.message || 'Failed to link account.');
      }
    }
  };

  const loginWithGoogle = async () => {
    if (!auth) return;
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      if (auth.currentUser) await syncLocalDataToFirestore(auth.currentUser.uid);
    } catch (err) {
      setError((err as AuthError).message || 'Failed to log in with Google.');
    }
  };

  const loginWithEmail = async (e: string, p: string) => {
    if (!auth) return;
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, e, p);
      if (auth.currentUser) await syncLocalDataToFirestore(auth.currentUser.uid);
    } catch (err) {
      setError((err as AuthError).message || 'Invalid email or password.');
    }
  };

  const signUpWithEmail = async (e: string, p: string) => {
    if (!auth?.currentUser) return;
    setError(null);
    try {
      const credential = EmailAuthProvider.credential(e, p);
      await linkWithCredential(auth.currentUser, credential);
      await syncLocalDataToFirestore(auth.currentUser.uid);
    } catch (err) {
      const authError = err as AuthError;
      if (authError.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please log in instead.');
      } else {
        setError(authError.message || 'Failed to create account.');
      }
    }
  };

  const isDevMode = isAdmin(user);

  return (
    <AuthContext.Provider value={{ 
      user, loading, linkAccount, loginWithGoogle, loginWithEmail, signUpWithEmail, error, isDevMode 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
