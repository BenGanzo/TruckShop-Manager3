// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA5P6Jj--CRE4CdFA9tqiPYpSItzxnsr20',
  authDomain: 'truck-shop-manager.firebaseapp.com',
  projectId: 'truck-shop-manager',
  storageBucket: 'truck-shop-manager.appspot.com',
  messagingSenderId: '832271401611',
  appId: '1:832271401611:web:9fb4d76bdd4d4a3b59ba0e',
};

// Singleton (evita múltiples inicializaciones)
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
