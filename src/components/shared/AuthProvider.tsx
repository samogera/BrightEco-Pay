
'use client';

import React, { createContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import {
  Auth,
  getAuth,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { app } from '@/lib/firebase';

interface AuthContextType {
  auth: Auth;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    auth: getAuth(app),
    user: null,
    setUser: () => {},
    loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = getAuth(app);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const value = { auth, user, setUser, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
