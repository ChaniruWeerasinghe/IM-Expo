import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDQo2a_uOTgTOJykLNvswF5pNWu88Ol_9s",
  authDomain: "im-expo-1db71.firebaseapp.com",
  projectId: "im-expo-1db71",
  storageBucket: "im-expo-1db71.appspot.com",
  messagingSenderId: "587634854925",
  appId: "1:587634854925:web:21f82229665b1b491fd944"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
