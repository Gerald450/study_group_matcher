// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCs7Van3dlOXonZA_k6IBWfj4cRb2dNFx8",
  authDomain: "study-matcher-9d210.firebaseapp.com",
  projectId: "study-matcher-9d210",
  storageBucket: "study-matcher-9d210.firebasestorage.app",
  messagingSenderId: "368902764417",
  appId: "1:368902764417:web:b9a148514cada7aa8c1a80",
  measurementId: "G-25JCE2B8B8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app)