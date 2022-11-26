import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyA5JEadZzVUBGMrn0dygRdx5t-5uqAuBKo",
//   authDomain: "context-187ec.firebaseapp.com",
//   projectId: "context-187ec",
//   storageBucket: "context-187ec.appspot.com",
//   messagingSenderId: "248587359534",
//   appId: "1:248587359534:web:825b31a2224c23f67096bf"
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyCVAgh7RpDc4i6Sh2Tu4HFHYalAZ2WGBUs",
//   authDomain: "social-e7a3f.firebaseapp.com",
//   projectId: "social-e7a3f",
//   storageBucket: "social-e7a3f.appspot.com",
//   messagingSenderId: "906751269754",
//   appId: "1:906751269754:web:b81222b46808165f8394c3",
//   measurementId: "G-ZDXPMMG9XV"
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyBwOzhcaTYFKRkNkyW2OzYP07z_8AhUVo0",
//   authDomain: "social7-abee6.firebaseapp.com",
//   projectId: "social7-abee6",
//   storageBucket: "social7-abee6.appspot.com",
//   messagingSenderId: "274329093237",
//   appId: "1:274329093237:web:6196d88aaab4f31a9f643c",
//   measurementId: "G-JYKP8H0LHB"
// };

const firebaseConfig = {
  apiKey: "AIzaSyCC_JvwrSi8acZzbTYYus55zxFbw5_B5PM",
  authDomain: "angular-75d1c.firebaseapp.com",
  projectId: "angular-75d1c",
  storageBucket: "angular-75d1c.appspot.com",
  messagingSenderId: "971836986652",
  appId: "1:971836986652:web:e269bd3dd3663b9a6d56d9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);



