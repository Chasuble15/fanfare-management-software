import {
    firebase
} from "@firebase/app";
import "@firebase/firestore";
import 'firebase/storage';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyD04HrNgblM06GjX-fXcs91Z7-HjQC5soU",
    authDomain: "fanfaremanagementsoftware.firebaseapp.com",
    databaseURL: "https://fanfaremanagementsoftware.firebaseio.com",
    projectId: "fanfaremanagementsoftware",
    storageBucket: "fanfaremanagementsoftware.appspot.com",
    messagingSenderId: "211418318000",
    appId: "1:211418318000:web:7c3c6ce0fe5b7d94d12775",
    measurementId: "G-34ESHXM7ZP"
});

export const db = firebaseApp.firestore();
export const st = firebaseApp.storage().ref();