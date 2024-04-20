// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore
const firebaseConfig = {
    apiKey: "-",
    authDomain: "-",
    projectId: "-",
    storageBucket: "-",
    messagingSenderId: "-",
    appId: "-",
    measurementId: "-"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized successfully!"); // Added console log

const analytics = getAnalytics(app);

export const db = getFirestore(app);

export default app;
