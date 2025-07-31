
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
import { app } from '@/lib/firebase';

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
  
  const setupRecaptcha = (containerId: string) => {
    if (typeof window !== 'undefined') {
        const verifierId = `recaptcha-verifier-${containerId}`;
        if ((window as any)[verifierId]) {
            return (window as any)[verifierId];
        }

        (window as any)[verifierId] = new RecaptchaVerifier(auth, containerId, {
            'size': 'invisible',
            'callback': (response: any) => {
              console.log("reCAPTCHA solved");
            },
            'expired-callback': () => {
                console.error("reCAPTCHA expired");
            }
        });
        return (window as any)[verifierId];
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
    return firebaseSignOut(auth);
  };
  
  const updateUserProfile = async (profile: { displayName?: string, photoURL?: string }) => {
    if (auth.currentUser) {
        await updateProfile(auth.currentUser, profile);
        // This is a common pattern to force a state refresh in the AuthProvider
        // by re-triggering the onAuthStateChanged listener with the updated user.
        // As we don't have direct access to the setter, this is a workaround.
        // A better approach would be a dedicated state management library.
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
      await updateProfile(auth.currentUser, { photoURL });
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
