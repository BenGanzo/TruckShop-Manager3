
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const app = initializeApp(firebaseConfig);

export { app };
