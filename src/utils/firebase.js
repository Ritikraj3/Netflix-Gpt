// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBqH7L_0xxbyFHeGmNSGfDfOLjQ7_FAs4",
  authDomain: "netflixgpt-v69.firebaseapp.com",
  projectId: "netflixgpt-v69",
  storageBucket: "netflixgpt-v69.firebasestorage.app",
  messagingSenderId: "695493841384",
  appId: "1:695493841384:web:028a1c09573487ed5ad45d",
  measurementId: "G-1WYZTTRTFL"
};

const app = initializeApp(firebaseConfig);
// Analytics is not supported in all environments (e.g. some browsers block it)
isSupported().then((yes) => yes && getAnalytics(app)).catch(() => {});

export const auth = getAuth();
export const db = getFirestore(app);


