import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import * as functions from "firebase-functions";

const app = initializeApp(functions.config().firebase);

const firestore = getFirestore(app);
const messaging = getMessaging(app);

export const firebase = { firestore, messaging };
