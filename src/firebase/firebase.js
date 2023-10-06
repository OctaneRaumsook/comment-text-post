// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBi_R9T6xkn1G1b115jX8nLd4jc87t9mZY",
  authDomain: "looklike-db.firebaseapp.com",
  projectId: "looklike-db",
  storageBucket: "looklike-db.appspot.com",
  messagingSenderId: "984043797138",
  appId: "1:984043797138:web:dcc0026f4f61911800444b",
  measurementId: "G-1663M16VGS"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore();

export { app, firestore };
