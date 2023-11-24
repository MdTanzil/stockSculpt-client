// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3T24xPyrHaZeKIsi6sI6jUabCJbjphjc",
  authDomain: "stocksculpt.firebaseapp.com",
  projectId: "stocksculpt",
  storageBucket: "stocksculpt.appspot.com",
  messagingSenderId: "540906861111",
  appId: "1:540906861111:web:35b502a79db3dc575105b2"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
 export default app;