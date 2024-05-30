import firebase from "./index.js";
import { ui, uiConfig } from "./auth.js";

ui.start("#firebaseui-auth-container", uiConfig);

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    console.log("user is signed out");
    localStorage.removeItem("user");
  }
});
