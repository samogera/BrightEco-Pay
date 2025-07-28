
'use client';

import { useContext } from 'react';
import {
  AuthContext
} from '@/components/shared/AuthProvider';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    updateProfile,
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const useAuth = () => {
  const { auth, user, loading } = useContext(AuthContext);

  const signInWithEmail = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = (email: string, pass: string) => {
    return createUserWithEmailAndPassword(auth, email, pass);
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };
  
  const setupRecaptcha = (phoneNumber: string) => {
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log("recaptcha solved")
        }
    });
    return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
  }

  const signInWithPhone = (phoneNumber: string) => {
      return setupRecaptcha(phoneNumber);
  };

  const signOut = () => {
    return firebaseSignOut(auth);
  };
  
  const updateUserProfile = async (profile: { displayName?: string, photoURL?: string }) => {
    if (auth.currentUser) {
        await updateProfile(auth.currentUser, profile);
        return auth.currentUser;
    }
    throw new Error("No user is signed in.");
  }
  
  const updateUserAvatar = async (file: File) => {
    if (auth.currentUser) {
      const storage = getStorage();
      const storageRef = ref(storage, `avatars/${auth.currentUser.uid}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(snapshot.ref);
      return photoURL;
    }
    throw new Error("No user is signed in.");
  }

  return { 
    user, 
    loading, 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithGoogle, 
    signInWithPhone,
    signOut,
    updateUserProfile,
    updateUserAvatar,
    };
};
