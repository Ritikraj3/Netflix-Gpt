// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBqH7L_0xxbyFHeGmNSGfDfOLjQ7_FAs4",
  authDomain: "netflixgpt-v69.firebaseapp.com",
  projectId: "netflixgpt-v69",
  storageBucket: "netflixgpt-v69.firebasestorage.app",
  messagingSenderId: "695493841384",
  appId: "1:695493841384:web:028a1c09573487ed5ad45d",
  measurementId: "G-1WYZTTRTFL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();


