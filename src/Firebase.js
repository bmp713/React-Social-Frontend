import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA5JEadZzVUBGMrn0dygRdx5t-5uqAuBKo",
  authDomain: "context-187ec.firebaseapp.com",
  projectId: "context-187ec",
  storageBucket: "context-187ec.appspot.com",
  messagingSenderId: "248587359534",
  appId: "1:248587359534:web:825b31a2224c23f67096bf"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyCJvgqmdDv9MGhdQ9T0qqNQnm6YFzbjbGU",
//   authDomain: "react-ea25e.firebaseapp.com",
//   projectId: "react-ea25e",
//   storageBucket: "react-ea25e.appspot.com",
//   messagingSenderId: "753454879893",
//   appId: "1:753454879893:web:2a5af30a542ced76b1b79c"
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyCC_JvwrSi8acZzbTYYus55zxFbw5_B5PM",
//   authDomain: "angular-75d1c.firebaseapp.com",
//   projectId: "angular-75d1c",
//   storageBucket: "angular-75d1c.appspot.com",
//   messagingSenderId: "971836986652",
//   appId: "1:971836986652:web:e269bd3dd3663b9a6d56d9" 
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);



