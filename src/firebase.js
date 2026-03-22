import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQIc8r_hd5cXXcTQecgJZR9XXuEgJ-U_o",
  authDomain: "chortcut-5ad23.firebaseapp.com",
  projectId: "chortcut-5ad23",
  storageBucket: "chortcut-5ad23.firebasestorage.app",
  messagingSenderId: "1049318535899",
  appId: "1:1049318535899:web:5818054bc774a74f7f92fe",
  measurementId: "G-P9YBEWTNH1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
