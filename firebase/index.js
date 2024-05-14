// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChzZfDPbQrNb1Z6MY27hTpWA2W0pr_b6M",
  authDomain: "one-story-e75fa.firebaseapp.com",
  projectId: "one-story-e75fa",
  storageBucket: "one-story-e75fa.appspot.com",
  messagingSenderId: "564570756931",
  appId: "1:564570756931:web:93941811ddab0741f481f6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export{
    db
}