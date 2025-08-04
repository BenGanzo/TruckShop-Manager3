
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5P6Jj--CRE4CdFA9tqiPypSItzxnsr20",
  authDomain: "truck-shop-manager.firebaseapp.com",
  projectId: "truck-shop-manager",
  storageBucket: "truck-shop-manager.appspot.com",
  messagingSenderId: "832217401611",
  appId: "1:832217401611:web:9fb4d76bdd4d4a3b59ba0e"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
