import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "ai-startups-hub.firebaseapp.com",
    projectId: "ai-startups-hub",
    storageBucket: "ai-startups-hub.appspot.com",
    messagingSenderId: "1045138626227",
    appId: "1:1045138626227:web:5b4e74f7ce9ac8df2bc2c6",
    measurementId: "G-XSYJLJEG14"
};
  
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);