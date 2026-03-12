import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBWrX_t19QegINRrJrdRGIaaGDikZXxiNA",
  authDomain: "apu-noc-inventory.firebaseapp.com",
  projectId: "apu-noc-inventory",
  storageBucket: "apu-noc-inventory.firebasestorage.app",
  messagingSenderId: "200409980080",
  appId: "1:200409980080:web:e1a70cc5d6d3af2df9af75"
};

firebase.initializeApp(firebaseConfig);

export default firebase;