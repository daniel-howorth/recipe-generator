import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import * as firebaseui from "firebaseui";

const firebaseConfig = {
  apiKey: "AIzaSyC44pe49fNHZPEFUzHFMcIKNidCGLIwEAw",
  authDomain: "recipe-generator-c1fdb.firebaseapp.com",
  projectId: "recipe-generator-c1fdb",
  storageBucket: "recipe-generator-c1fdb.appspot.com",
  messagingSenderId: "824828698274",
  appId: "1:824828698274:web:d676710052aaccba1f41fb",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
