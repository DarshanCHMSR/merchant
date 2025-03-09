// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXUw5-mcBnkA5eXTAmslG40qLgzM_yUSc",
  authDomain: "merchant-a22b7.firebaseapp.com",
  projectId: "merchant-a22b7",
  storageBucket: "merchant-a22b7.firebasestorage.app",
  messagingSenderId: "516713581848",
  appId: "1:516713581848:web:5ec4c20e83391bf919e26d",
  measurementId: "G-CF1B9WQSBW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);