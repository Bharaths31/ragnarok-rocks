// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfkduYdks7VtCIN53sWoSzl2l2ftvHpwk",
  authDomain: "portfolio-ragnarok.firebaseapp.com",
  projectId: "portfolio-ragnarok",
  storageBucket: "portfolio-ragnarok.firebasestorage.app",
  messagingSenderId: "166091150956",
  appId: "1:166091150956:web:db1ecb69a905fc7b896a49",
  measurementId: "G-Z8WXVLN3JJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };