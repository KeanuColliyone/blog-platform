// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Firebase Authentication

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5pgkRqJqzn-ad_BhNPNirSRgw-_eM634",
  authDomain: "blog-platform-3670d.firebaseapp.com",
  projectId: "blog-platform-3670d",
  storageBucket: "blog-platform-3670d.appspot.com",
  messagingSenderId: "676225726400",
  appId: "1:676225726400:web:bd5e08b39cfc6bddbffa25",
  measurementId: "G-VNQ6J124YK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Authentication

// Export the auth object for use in other files
export { auth };