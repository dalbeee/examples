import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import {
  CACHE_SIZE_UNLIMITED,
  Firestore,
  connectFirestoreEmulator,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { Analytics, getAnalytics } from "firebase/analytics";
import { getAuth, Auth, connectAuthEmulator } from "firebase/auth";
import {
  Functions,
  getFunctions,
  connectFunctionsEmulator,
} from "firebase/functions";
import { FirebaseStorage } from "firebase/storage";
import { Messaging, getMessaging } from "firebase/messaging";

let app: FirebaseApp | null = null;
let analytics: Analytics;
let firestore: Firestore;
let auth: Auth;
let functions: Functions;
let storage: FirebaseStorage;
let messaging: Messaging;

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID,
};

if (!firebaseConfig.projectId)
  console.error("Firebase config is missing. Check your .env file.");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!(app as any)?.name) {
  app = initializeApp(firebaseConfig);
  if (app.name && typeof window !== "undefined") {
    analytics = getAnalytics(app);
    firestore = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
        cacheSizeBytes: CACHE_SIZE_UNLIMITED,
      }),
    });
    auth = getAuth();
    functions = getFunctions(app, "asia-northeast3");
    messaging = getMessaging(app);

    if (import.meta.env.VITE_DEV_FIREBASE) {
      connectFirestoreEmulator(firestore, "localhost", 8080);
      connectFunctionsEmulator(functions, "localhost", 5001);
      connectAuthEmulator(auth, "http://localhost:9099");
    }
  }
}

export { analytics, firestore, auth, functions, storage, messaging };
