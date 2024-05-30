import firebase from "./index.js";
import "firebase/compat/auth";
import * as firebaseui from "firebaseui";

export const uiConfig = {
  signInSuccessUrl: "search-recipes.html",
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
      requireDisplayName: false,
    },
    // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
  ],
};

export const ui = new firebaseui.auth.AuthUI(firebase.auth());

export async function signOutUser() {
  try {
    await firebase.auth().signOut();
    console.log("user signed out");
    localStorage.removeItem("user");
    window.location.href = "index.html";
  } catch (error) {
    console.log("there was a problem when signing out user");
    console.error(error);
  }
}
