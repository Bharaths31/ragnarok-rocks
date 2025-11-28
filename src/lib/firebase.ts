import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfkduYdks7VtCIN53sWoSzl2l2ftvHpwk",
  authDomain: "portfolio-ragnarok.firebaseapp.com",
  projectId: "portfolio-ragnarok",
  storageBucket: "portfolio-ragnarok.firebasestorage.app",
  messagingSenderId: "166091150956",
  appId: "1:166091150956:web:db1ecb69a905fc7b896a49",
  measurementId: "G-Z8WXVLN3JJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);