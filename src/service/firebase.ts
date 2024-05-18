// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-2CQJakQM6gzmbgCWpn-PdMEqm2c2f44",
  authDomain: "go-cab-e7004.firebaseapp.com",
  projectId: "go-cab-e7004",
  storageBucket: "go-cab-e7004.appspot.com",
  messagingSenderId: "1023075533698",
  appId: "1:1023075533698:web:1a664d0dab97f21d58c59b"
};

// Initialize Firebase
const Firebase = initializeApp(firebaseConfig);
export const auth=getAuth(Firebase)

export default {Firebase,auth}