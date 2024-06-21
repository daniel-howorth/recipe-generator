import "../css/main.css";
import "../css/login.css";

import firebase from "./firebase-config.js";
import { ui, uiConfig } from "./auth.js";

ui.start("#firebaseui-auth-container", uiConfig);

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log("current user:", user.uid);
  } else {
    console.log("user is signed out");
  }
});
