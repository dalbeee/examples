import * as functions from "firebase-functions/v1";

import dayjs = require("dayjs");

import { firebase } from "./firebase";
import { getAuth } from "firebase-admin/auth";

const signUpTrigger = functions
  .region("asia-northeast3")
  .auth.user()
  .onCreate(async (user, conext) => {
    functions.logger.log("onCreate", user, conext);

    const date = dayjs().toDate();
    const data = {
      createdAt: date,
      updatedAt: date,
      id: user.uid,
      email: user.email!,
      devices: [],
      tier: { grade: "free", expiredAt: null },
    };

    const userRef = firebase.firestore.collection("users").doc(user.uid);
    userRef.set(data);

    await getAuth().setCustomUserClaims(user.uid, {
      tier: { grade: "free", expiredAt: null },
    });
  });

export { signUpTrigger };
