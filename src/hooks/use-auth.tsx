
'use client';

import { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '@/components/shared/AuthProvider';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider,
    signOut as firebaseSignout,
    updateProfile,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    User,
    signInWithRedirect,
    getRedirectResult
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { useToast } from './use-toast';

export interface UserData {
  address?: string;
  // Add any other user-specific data fields here
}

export const useAuth = () => {
  const { auth, user, setUser, loading } = useContext(AuthContext);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isUserDataLoading, setIsUserDataLoading] = useState(true);
  const { toast } = useToast();

  const updateUserDataInFirestore = useCallback(async (uid: string, data: Partial<UserData>) => {
    const db = getFirestore(app);
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, data, { merge: true });
  }, []);

  // Effect to handle redirect result from Google Sign-In
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          toast({ title: 'Login Successful', description: 'Welcome!' });
          const userDocRef = doc(getFirestore(app), 'users', result.user.uid);
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            await updateUserDataInFirestore(result.user.uid, { address: '' });
          }
        }
      } catch (error: any) {
        toast({ title: 'Login Failed', description: error.message, variant: 'destructive' });
      }
    };
    
    handleRedirectResult();
  }, [auth, toast, updateUserDataInFirestore]);

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
        setDoc(userDocRef, {}); 
        setUserData({});
      }
       setIsUserDataLoading(false);
    });

    return () => unsubscribe();
  }, [user]);



  const signInWithEmail = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateUserDataInFirestore(userCredential.user.uid, {});
    return userCredential;
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    // For a better mobile experience and to avoid pop-up blocker issues,
    // we use signInWithRedirect instead of signInWithPopup.
    await signInWithRedirect(auth, provider);
  };
  
  const setupRecaptcha = (containerId: string) => {
    if (typeof window !== 'undefined') {
        if ((window as any).recaptchaVerifier) {
            (window as any).recaptchaVerifier.clear();
        }

        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
            'size': 'invisible',
            'callback': () => {},
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
  
  const updateUserProfile = async (profile: { displayName?: string, photoURL?: string }, data?: Partial<UserData>) => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No user is signed in.");
    
    // Update Firebase Auth profile
    if (Object.keys(profile).length > 0) {
      await updateProfile(currentUser, profile);
    }
    
    // Update Firestore data
    if (data && Object.keys(data).length > 0) {
      await updateUserDataInFirestore(currentUser.uid, data);
    }

    // Update the user state in the context to reflect changes immediately
    setUser(auth.currentUser);
  }
  
  const updateUserAvatar = async (file: File): Promise<string> => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
       throw new Error("No user is signed in.");
    }
    const storage = getStorage(app);
    const storageRef = ref(storage, `avatars/${currentUser.uid}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(snapshot.ref);
    
    // We only update the profile with the new URL, this triggers `onAuthStateChanged`
    await updateProfile(currentUser, { photoURL });
    setUser({ ...currentUser, photoURL }); // Force immediate state update
    
    return photoURL;
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
    updateUserProfile,
    updateUserAvatar,
    };
};
