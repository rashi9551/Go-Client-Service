// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // If you still need auth
import { getAnalytics } from "firebase/analytics";

// Your new Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKnuhYPwvQ7LWUNCbBNgSFTlXBtHCFoqA",
  authDomain: "go-cab-be26d.firebaseapp.com",
  projectId: "go-cab-be26d",
  storageBucket: "go-cab-be26d.appspot.com",
  messagingSenderId: "638225609432",
  appId: "1:638225609432:web:c893e084d9536c8b5eddad",
  measurementId: "G-VPJ6LQZTML"
};



const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export const auth = getAuth(app);


export { app, analytics };

export default { app, analytics, auth }; 
