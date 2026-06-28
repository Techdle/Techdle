'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User, AuthError } from 'firebase/auth';
import { syncLocalDataToFirestore } from '../lib/storage';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  linkAccount: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  linkAccount: async () => {},
  loginWithGoogle: async () => {},
  error: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function initAuth() {
      const { auth, isConfigured } = await import('../lib/firebase');
      const { onAuthStateChanged, signOut } = await import('firebase/auth');

      if (!isConfigured || !auth) {
        setLoading(false);
        return;
      }

      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          if (currentUser.isAnonymous) {
            // Sign out legacy anonymous accounts so they run locally
            await signOut(auth);
            setLoading(false);
            return;
          }
          setUser(currentUser);
          setLoading(false);
          await syncLocalDataToFirestore(currentUser.uid);
        } else {
          setLoading(false);
        }
      });
    }

    initAuth();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const linkAccount = async () => {
    const { auth } = await import('../lib/firebase');
    const { linkWithPopup, GoogleAuthProvider } = await import('firebase/auth');
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
    const { auth } = await import('../lib/firebase');
    const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
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

  return (
    <AuthContext.Provider value={{ 
      user, loading, linkAccount, loginWithGoogle, error 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
