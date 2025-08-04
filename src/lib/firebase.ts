// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration - THIS IS A PUBLIC CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBe_kCj8a2zozwAZFDcRIRfD4hA4Pj-3pE",
  authDomain: "truckshop-manager-3a957.firebaseapp.com",
  projectId: "truckshop-manager-3a957",
  storageBucket: "truckshop-manager-3a957.appspot.com",
  messagingSenderId: "1038423233256",
  appId: "1:1038423233256:web:614b73523c914022a36417"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
