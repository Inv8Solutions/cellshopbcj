// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgInznwkkBpjtcvR1bcJDuee2pDcMbj_k",
  authDomain: "cellshopbcj.firebaseapp.com",
  projectId: "cellshopbcj",
  storageBucket: "cellshopbcj.firebasestorage.app",
  messagingSenderId: "758252550225",
  appId: "1:758252550225:web:44b531613cea8fc414a070",
  measurementId: "G-5QWBMKRWPJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

export default app;