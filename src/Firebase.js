import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDNZUr6Qkel2A6KuYdaU-A9_usUz4Oc-aw",
  authDomain: "netflix-clone-a416b.firebaseapp.com",
  projectId: "netflix-clone-a416b",
  storageBucket: "netflix-clone-a416b.appspot.com",
  messagingSenderId: "1040257982611",
  appId: "1:1040257982611:web:f481b549762ca44151ad66"
};

// Initialize Firebase
const firebaseapp = firebase.initializeApp(firebaseConfig);
const db = firebaseapp.firestore();
const auth = firebase.auth();

export {auth};
export default db;