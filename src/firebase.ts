import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); // Using configured database
export const auth = getAuth(app);

// Initialize App Check
// initializeAppCheck(app, {
//   provider: new ReCaptchaV3Provider('6LcYo4YsAAAAAKbi2rXNDLaYlTXUtqAbu1PI5_kM'),
//   isTokenAutoRefreshEnabled: true
// });
