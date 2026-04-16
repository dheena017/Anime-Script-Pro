import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

/**
 * FIREBASE INITIALIZATION & SAFETY
 */

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

try {
  // Validate basic config requirements
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error("CRITICAL: Firebase Configuration is missing key fields (API Key or Project ID). Check your firebase-applet-config.json");
  }

  // Handle Hot Module Replacement (HMR) by checking if app is already initialized
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  auth = getAuth(app);

} catch (error) {
  console.error("FAILED TO INITIALIZE FIREBASE:", error);
  // Re-throw so the ErrorBoundary in App.tsx can catch it and display the UI
  throw error;
}

export { db, auth, app };
