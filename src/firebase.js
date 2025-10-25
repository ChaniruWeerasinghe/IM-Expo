// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCFXcJtYTjA3_K3D5sCXqFX7h14vrY3lVE",
  authDomain: "im-expo-1e3fd.firebaseapp.com",
  databaseURL: "https://im-expo-1e3fd-default-rtdb.firebaseio.com",
  projectId: "im-expo-1e3fd",
  storageBucket: "im-expo-1e3fd.firebasestorage.app",
  messagingSenderId: "293295577473",
  appId: "1:293295577473:web:f384b90c1c2acac9e8f080",
  measurementId: "G-G4EZPN9KVG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);          // <-- Authentication
export const db = getDatabase(app);        // <-- Realtime Database
