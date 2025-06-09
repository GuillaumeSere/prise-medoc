import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyCQIG4VXmqiYVXqlif1rf5QxpEBt6Y9o4I", 
  authDomain: "prise-medoc.firebaseapp.com",
  projectId: "prise-medoc",
  storageBucket: "prise-medoc.firebasestorage.app",
  messagingSenderId: "2555944769",
  appId: "1:2555944769:web:d839cea57cacc6c53b8bc0",
   measurementId: "G-DSEGPZ4GFN"
};

// Initialiser Firebase une seule fois
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app); 
