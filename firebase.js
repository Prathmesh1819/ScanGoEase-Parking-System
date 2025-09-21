// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDxcz5TpXHKQFondDXs4J-y7J5FAFI7MvA",
  authDomain: "scan-go-ease.firebaseapp.com",
  databaseURL: "https://scan-go-ease-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "scan-go-ease",
  storageBucket: "scan-go-ease.firebasestorage.app",
  messagingSenderId: "1021148822504",
  appId: "1:1021148822504:web:5ffce7af491140d496c25d",
  measurementId: "G-R1ZR5VEMPB"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Database instance
export const db = getDatabase(app);
