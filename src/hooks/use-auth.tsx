
'use client';

import { useContext, useEffect } from 'react';
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

export const useAuth = () => {
  const { auth, user, setUser, loading } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth, setUser]);


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
        // Avoid re-creating the verifier if it already exists.
        if ((window as any).recaptchaVerifier) {
            return (window as any).recaptchaVerifier;
        }

        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
            'size': 'invisible',
            'callback': (response: any) => {
              console.log("reCAPTCHA solved");
            },
            'expired-callback': () => {
                console.error("reCAPTCHA expired, please try again.");
                if((window as any).recaptchaVerifier) {
                    (window as any).recaptchaVerifier.render().then((widgetId: any) => {
                        (window as any).recaptchaVerifier.reset(widgetId);
                    });
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
    return firebaseSignOut(auth);
  };
  
  const updateUserProfile = async (profile: { displayName?: string, photoURL?: string }) => {
    if (auth.currentUser) {
        await updateProfile(auth.currentUser, profile);
        // Manually update the user in our context to trigger a re-render
        setUser({...auth.currentUser});
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
      await updateUserProfile({ photoURL }); // Update profile with new URL
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
