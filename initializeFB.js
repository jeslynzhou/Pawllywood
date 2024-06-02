import { initializeApp } from '@firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCGHpSfjU4CJ02RtoGp_01j5cF6P629epg",
  authDomain: "pawllywood-abc3e.firebaseapp.com",
  projectId: "pawllywood-abc3e",
  storageBucket: "pawllywood-abc3e.appspot.com",
  messagingSenderId: "62836081451",
  appId: "1:62836081451:web:7ccb964474f61b6c5c3b6e",
  measurementId: "G-5GGHJXB9BP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// export app
export { app };