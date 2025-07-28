
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
    onAuthStateChanged,
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '@/lib/firebase';
import { useToast } from './use-toast';

export const useAuth = () => {
  const { auth, user, loading } = useContext(AuthContext);
  const { toast } = useToast();

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
  
  const setupRecaptcha = () => {
    if (typeof window !== 'undefined' && !(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response: any) => {
              // reCAPTCHA solved, you can now send the phone number.
              console.log("reCAPTCHA solved, ready to send phone number.");
            },
            'expired-callback': () => {
                // Response expired. Ask user to solve reCAPTCHA again.
                toast({ title: 'reCAPTCHA Expired', description: 'Please try sending the code again.', variant: 'destructive' });
            }
        });
    }
  }

  const signInWithPhone = (phoneNumber: string) => {
      setupRecaptcha();
      const appVerifier = (window as any).recaptchaVerifier;
      return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  };

  const signOut = () => {
    return firebaseSignOut(auth);
  };
  
  const updateUserProfile = async (profile: { displayName?: string, photoURL?: string }) => {
    if (auth.currentUser) {
        await updateProfile(auth.currentUser, profile);
        // Manually trigger a state update if needed, as onAuthStateChanged might not fire for profile updates.
        return {...auth.currentUser};
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
    signInWithEmail, 
    signUpWithEmail, 
    signInWithGoogle, 
    signInWithPhone,
    signOut,
    updateUserProfile,
    updateUserAvatar,
    };
};
