// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "brighteco-pay",
  appId: "1:1075734567394:web:659b0921cdfe6a4476c1bb",
  storageBucket: "brighteco-pay.firebasestorage.app",
  apiKey: "AIzaSyA0fl2iVmv1UY1RwlNDtYHbORtHEeV22Ao",
  authDomain: "brighteco-pay.firebaseapp.com",
  messagingSenderId: "1075734567394",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
