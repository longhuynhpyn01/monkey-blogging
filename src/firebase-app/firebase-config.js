import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAM9uGF1jFQ0tr24MQ-iIjXd-W2nxQ5QUA",
  authDomain: "monkey-blogging-64b20.firebaseapp.com",
  projectId: "monkey-blogging-64b20",
  storageBucket: "monkey-blogging-64b20.appspot.com",
  messagingSenderId: "215731524777",
  appId: "1:215731524777:web:d0fc00e33cdbe02fd305b8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // sử dụng fireStore để thêm, xóa, sửa firebase
export const auth = getAuth(app);
