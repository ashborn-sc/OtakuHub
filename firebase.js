import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB27AWb3dSE5yYgtI0PPD2VRHBwHGVREh4",
  authDomain: "project-otaku-2e649.firebaseapp.com",
  projectId: "project-otaku-2e649",
  storageBucket: "project-otaku-2e649.firebasestorage.app",
  messagingSenderId: "424500619316",
  appId: "1:424500619316:web:74d6d1d32e26860fef4261",
   measurementId: "G-V5RP5GYCKF"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
