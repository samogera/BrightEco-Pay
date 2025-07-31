
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
    User,
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

export interface UserData {
  address?: string;
  // Add any other user-specific data fields here
}

export const useAuth = () => {
  const { auth, user, setUser, loading } = useContext(AuthContext);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isUserDataLoading, setIsUserDataLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setIsUserDataLoading(false);
      return;
    }
    
    setIsUserDataLoading(true);
    const db = getFirestore(app);
    const userDocRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        setUserData(doc.data() as UserData);
      } else {
        // This case can happen for users who signed up before the users collection was standard
        // We can create a document for them here.
        setDoc(userDocRef, {}); 
        setUserData({});
      }
       setIsUserDataLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const updateUserData = useCallback(async (data: Partial<UserData>) => {
    if (!user) throw new Error("No user is signed in.");
    const db = getFirestore(app);
    const userDocRef = doc(db, 'users', user.uid);
    // Use updateDoc for existing fields, or setDoc with merge for creating/updating
    await setDoc(userDocRef, data, { merge: true });
  }, [user]);

  const signInWithEmail = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    // Create an empty user document in Firestore upon sign-up
    const db = getFirestore(app);
    await setDoc(doc(db, 'users', userCredential.user.uid), {});
    return userCredential;
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const db = getFirestore(app);
    const userDocRef = doc(db, 'users', result.user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      // Create user doc if it doesn't exist (first-time Google sign-in)
      await setDoc(userDocRef, {
        address: ''
      });
    }
    return result;
  };
  
  const setupRecaptcha = (containerId: string) => {
    if (typeof window !== 'undefined') {
        if ((window as any).recaptchaVerifier) {
            (window as any).recaptchaVerifier.clear();
        }

        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
            'size': 'invisible',
            'callback': () => {
              // reCAPTCHA solved
            },
            'expired-callback': () => {
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
  
  const updateUserProfileAndData = async (profile: { displayName?: string, photoURL?: string }, data?: Partial<UserData>) => {
    if (!auth.currentUser) throw new Error("No user is signed in.");
    
    // Update Firebase Auth profile
    await updateProfile(auth.currentUser, profile);

    // Update the user state in the context to reflect changes immediately
    const updatedUser = { ...auth.currentUser, ...profile } as User;
    setUser(updatedUser);

    // Update Firestore data
    if (data) {
      await updateUserData(data);
    }
  }
  
  const updateUserAvatar = async (file: File) => {
    if (auth.currentUser) {
      const storage = getStorage(app);
      const storageRef = ref(storage, `avatars/${auth.currentUser.uid}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(snapshot.ref);
      await updateUserProfileAndData({ photoURL });
      return photoURL;
    }
    throw new Error("No user is signed in.");
  }

  return { 
    user, 
    loading: loading || isUserDataLoading,
    userData, 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithGoogle, 
    signInWithPhone,
    signOut,
    updateUserProfile: updateUserProfileAndData, // expose the combined function
    updateUserAvatar,
    updateUserData,
    };
};
