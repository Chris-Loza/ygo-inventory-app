// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "ygo-inventory-app.firebaseapp.com",
  projectId: "ygo-inventory-app",
  storageBucket: "ygo-inventory-app.appspot.com",
  messagingSenderId: "534630199224",
  appId: "1:534630199224:web:66da374c2abd13459b294d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Firebase authentication
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();