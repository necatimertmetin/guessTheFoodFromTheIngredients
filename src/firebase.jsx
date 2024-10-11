// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpAzk17fNOl0XKEVGOnAQqxQr2NqrXry8",
  authDomain: "guessthefood-f31ef.firebaseapp.com",
  projectId: "guessthefood-f31ef",
  storageBucket: "guessthefood-f31ef.appspot.com",
  messagingSenderId: "999736125935",
  appId: "1:999736125935:web:13deda8e27c08d23a22e1a",
  measurementId: "G-NEJ74TBLT7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Realtime Database'i başlatırken doğru URL'yi kullanın
const db = getDatabase(
  app,
  "https://guessthefood-f31ef-default-rtdb.europe-west1.firebasedatabase.app"
);

// db'yi dışa aktar
export { db };
