
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
  
  const setupRecaptcha = (phoneNumber: string) => {
    // To enable real phone number sign-in, you must upgrade to the Blaze plan
    // on your Firebase project to enable billing.
    // https://firebase.google.com/pricing
    // This function is currently mocked to allow development without billing.
    console.warn("Firebase phone auth is mocked. Upgrade to the Blaze plan for live functionality.");

    if (typeof window !== 'undefined' && !(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response: any) => {
              // reCAPTCHA solved, you can now send the phone number.
              console.log("reCAPTCHA solved, ready to send phone number.");
            }
        });
    }
    
    // In a real scenario, you would use:
    // const appVerifier = (window as any).recaptchaVerifier;
    // return signInWithPhoneNumber(auth, phoneNumber, appVerifier);

    // For now, we return a mock confirmation result.
    return Promise.resolve({
      confirm: async (verificationCode: string) => {
        if (verificationCode && verificationCode.length === 6) {
          // Simulate a successful sign-in
           toast({ title: 'Demo Sign-In', description: 'Phone number verified successfully (Simulated).' });
           // In a real app, Firebase would handle the user session automatically.
           // Here, we can't create a real user session without a real auth process.
           // The user will be "logged in" but will appear as an anonymous or placeholder user.
           return { user: { uid: `demo-${phoneNumber}` } };
        } else {
          throw new Error("Invalid verification code. Please enter a 6-digit code.");
        }
      },
    });
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
