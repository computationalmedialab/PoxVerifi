import { ConsoleSqlOutlined } from "@ant-design/icons";
import firebase from "firebase/compat/app";

import "firebase/compat/firestore";

// const firebaseConfig = {
//   apiKey: process.env.APIKEY,
//   authDomain: process.env.AUTHDOMAIN,
//   projectId: process.env.PROJECTID,
//   storageBucket: process.env.STORAGEBUCKET,
//   messagingSenderId: process.env.SENDERID,
//   appId: process.env.APPID,
// };

import { firebaseConfig } from "../keys";

export const initFirebase = async () => {
  try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase Initialized!");
    console.log(firebaseConfig);
  } catch (err) {
    console.log(err);
  }
};

export const addWebsite = async (url) => {
  const db = firebase.firestore();

  url = url.replaceAll("/", "-");

  db.collection("websites")
    .doc(url)
    .set({
      id_: url,
      upvote: 0,
      neutralvote: 0,
      downvote: 0,
    })
    .catch((error) => {
      console.error(error);
    });
};

export const getWebsite = async (url) => {
  url = url.replaceAll("/", "-");
  console.log(url);
  return firebase
    .firestore()
    .collection("websites")
    .doc(url)
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log(doc.data());
        return doc.data();
      } else {
        console.log("DNA");
        return "DNA";
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const castVote = async (url, amount) => {
  const db = firebase.firestore();
  url = url.replaceAll("/", "-");
  var dbRef = db.collection("websites").doc(url);

  dbRef.update({
    downvote: firebase.firestore.FieldValue.increment(amount[0]),
  });

  dbRef.update({
    neutralvote: firebase.firestore.FieldValue.increment(amount[1]),
  });

  dbRef.update({
    upvote: firebase.firestore.FieldValue.increment(amount[2]),
  });

  getWebsite(url);
};

export default firebase;
