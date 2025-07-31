
'use client';

import { useContext, useEffect, useState, useCallback } from 'react';
import {
  AuthContext
} from '@/components/shared/AuthProvider';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider,
    signOut as firebaseSignout,
    updateProfile,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    onAuthStateChanged,
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { app } from '@/lib/firebase';

export interface UserData {
  address?: string;
}

export const useAuth = () => {
  const { auth, user, setUser, loading } = useContext(AuthContext);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      return;
    }
    
    const db = getFirestore(app);
    const userDocRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        setUserData(doc.data() as UserData);
      } else {
        // Handle case where user exists in Auth but not in Firestore
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const updateUserData = useCallback(async (data: Partial<UserData>) => {
    if (!user) throw new Error("No user is signed in.");
    const db = getFirestore(app);
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, data, { merge: true });
  }, [user]);

  const signInWithEmail = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateUserData({}); // Create an empty user document in Firestore
    return userCredential;
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const db = getFirestore(app);
    const userDocRef = doc(db, 'users', result.user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      await updateUserData({});
    }
    return result;
  };
  
  const setupRecaptcha = (containerId: string) => {
    if (typeof window !== 'undefined') {
        // Destroy the old verifier if it exists
        if ((window as any).recaptchaVerifier) {
            (window as any).recaptchaVerifier.clear();
        }

        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
            'size': 'invisible',
            'callback': (response: any) => {
              console.log("reCAPTCHA solved");
            },
            'expired-callback': () => {
                console.error("reCAPTCHA expired, please try again.");
                if((window as any).recaptchaVerifier) {
                   (window as any).recaptchaVerifier.render().catch((err: any) => console.error("Recaptcha rerender failed", err));
                }
            }
        });
        return (window as any).recaptchaVerifier;
    }
    return null;
  }

  const signInWithPhone = (phoneNumber: string) => {
      const appVerifier = setupRecaptcha('recaptcha-container');
      if (!appVerifier) {
          throw new Error("reCAPTCHA verifier not initialized.");
      }
      return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  };

  const signOut = () => {
    return firebaseSignout(auth);
  };
  
  const updateUserProfile = async (profile: { displayName?: string, photoURL?: string }) => {
    if (auth.currentUser) {
        await updateProfile(auth.currentUser, profile);
        const updatedUser = Object.assign(Object.create(Object.getPrototypeOf(auth.currentUser)), auth.currentUser);
        setUser(updatedUser);
        return auth.currentUser;
    }
    throw new Error("No user is signed in.");
  }
  
  const updateUserAvatar = async (file: File) => {
    if (auth.currentUser) {
      const storage = getStorage(app);
      const storageRef = ref(storage, `avatars/${auth.currentUser.uid}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(snapshot.ref);
      await updateUserProfile({ photoURL });
      return photoURL;
    }
    throw new Error("No user is signed in.");
  }

  return { 
    user, 
    loading,
    userData, 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithGoogle, 
    signInWithPhone,
    signOut,
    updateUserProfile,
    updateUserAvatar,
    updateUserData,
    };
};
