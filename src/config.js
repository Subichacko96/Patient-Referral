// Import the functions you need from the SDKs you need

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

// TODO: Add SDKss for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHwmQej47pdvUziIEhQfdLVSRSCTNEQok",
  authDomain: "patient-referral-1c0bd.firebaseapp.com",
  projectId: "patient-referral-1c0bd",
  storageBucket: "patient-referral-1c0bd.appspot.com",
  messagingSenderId: "613870921855",
  appId: "1:613870921855:web:70d43aa0bfefc5a384b74a",
  measurementId: "G-DNPMS058RZ"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
  
export default db;

