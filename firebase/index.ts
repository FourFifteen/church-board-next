// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMMPOhXASdj_apdpEr7vXWNdEIr2ZLPh4",
  authDomain: "church-board-4ff13.firebaseapp.com",
  databaseURL: "https://church-board-4ff13-default-rtdb.firebaseio.com",
  projectId: "church-board-4ff13",
  storageBucket: "church-board-4ff13.appspot.com",
  messagingSenderId: "230773429799",
  appId: "1:230773429799:web:25b67a4868d7d0eaa62002",
  measurementId: "G-ECES2DECP0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
