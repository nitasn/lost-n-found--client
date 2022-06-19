import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyDgfc0x0fpQTUsw-fkSIcSXMR3ZQXsf9Bc',
  authDomain: 'lost-n-found-chat.firebaseapp.com',
  projectId: 'lost-n-found-chat',
  storageBucket: 'lost-n-found-chat.appspot.com',
  messagingSenderId: '870839189683',
  appId: '1:870839189683:web:4e8dcf2ad19d13488eb0c6',
  measurementId: 'G-4M53SGWP0T',
};

const app = initializeApp(config);

export const firestore = getFirestore(app);
