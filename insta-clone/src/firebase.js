import React from 'react';
import firebase from 'firebase';

const firebaseApp = firebase.initializeApp(
    {
        apiKey: "AIzaSyAiSUkc4lr1OuRrBkwpoz2a-1-sIaYwTWE",
        authDomain: "instagram-clone-8d26f.firebaseapp.com",
        projectId: "instagram-clone-8d26f",
        storageBucket: "instagram-clone-8d26f.appspot.com",
        messagingSenderId: "837972007202",
        appId: "1:837972007202:web:6655d28c4d9f10fae52d7b"}
);
    
export const db = firebaseApp.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();