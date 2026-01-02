
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBI4Su3YzW7avlJ9GUsNQvGYtv1YjzvHL4",
  authDomain: "arib-portfolio.firebaseapp.com",
  databaseURL: "https://arib-portfolio-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "arib-portfolio",
  storageBucket: "arib-portfolio.firebasestorage.app",
  messagingSenderId: "686166324284",
  appId: "1:686166324284:web:a7b91a8f84fdbbfbacff39"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
