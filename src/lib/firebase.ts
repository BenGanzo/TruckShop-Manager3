
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// INSTRUCCIONES: Reemplaza este objeto con la configuración de tu propio proyecto de Firebase.
// Puedes encontrarla en la configuración de tu proyecto en la consola de Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyA5P6Jj--CRE4CdFA9tqiPYpSItzxnsr20",
  authDomain: "POR_FAVOR_REEMPLAZA_CON_TU_AUTH_DOMAIN",
  projectId: "POR_FAVOR_REEMPLAZA_CON_TU_PROJECT_ID",
  storageBucket: "POR_FAVOR_REEMPLAZA_CON_TU_STORAGE_BUCKET",
  messagingSenderId: "POR_FAVOR_REEMPLAZA_CON_TU_MESSAGING_SENDER_ID",
  appId: "POR_FAVOR_REEMPLAZA_CON_TU_APP_ID"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
