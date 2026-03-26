import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWrX_t19QegINRrJrdRGIaaGDikZXxiNA",
  authDomain: "apu-noc-inventory.firebaseapp.com",
  projectId: "apu-noc-inventory",
  storageBucket: "apu-noc-inventory.firebasestorage.app",
  messagingSenderId: "200409980080",
  appId: "1:200409980080:web:e1a70cc5d6d3af2df9af75"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);