// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, serverTimestamp, onValue, update } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeiFNBarn4Ny2diM7Kb6EISFiE5fln9ws",
  authDomain: "parnresqsample.firebaseapp.com",
  projectId: "parnresqsample",
  storageBucket: "parnresqsample.firebasestorage.app",
  messagingSenderId: "1097156664050",
  appId: "1:1097156664050:web:37030db2661f2351c80e6b",
  databaseURL:"https://parnresqsample-default-rtdb.firebaseio.com/"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export { database, ref, set, serverTimestamp, onValue, update };
