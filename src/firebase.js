import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// REPLACE WITH YOUR FIREBASE CONFIGURATION
// You can get this from the Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: "AIzaSyCIS55esnmxek3hC-iNeuKOj__S0Xc3xC0",
  authDomain: "monitoring-jantung-kelompok-4.firebaseapp.com",
  databaseURL: "https://monitoring-jantung-kelompok-4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "monitoring-jantung-kelompok-4",
  storageBucket: "monitoring-jantung-kelompok-4.firebasestorage.app",
  messagingSenderId: "1091190995743",
  appId: "1:1091190995743:web:4319c3b566c10b0cbdce2a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);                     
export const db = getDatabase(app);
