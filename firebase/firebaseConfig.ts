// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDu6ughQSkTy_en3dXS2RmOmI_0BA0Rh3I",
  authDomain: "sample-firebase-ai-app-c8618.firebaseapp.com",
  projectId: "sample-firebase-ai-app-c8618",
  storageBucket: "sample-firebase-ai-app-c8618.firebasestorage.app",
  messagingSenderId: "422076667857",
  appId: "1:422076667857:web:70eed89423ca23cfbd72f0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
