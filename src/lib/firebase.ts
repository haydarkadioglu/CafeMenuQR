// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlX5IWdCCVVca4RUZhFAq9Z6hWH24oujg",
  authDomain: "cafemenuqr-382df.firebaseapp.com",
  projectId: "cafemenuqr-382df",
  storageBucket: "cafemenuqr-382df.appspot.com",
  messagingSenderId: "579284836636",
  appId: "1:579284836636:web:3a5b173a5a7909911b1ad9",
  measurementId: "G-7BMMEYNJYY"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
