import firebase from "./index.js";

const uiConfig = {
  signInSuccessUrl: "search-recipes.html",
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    // firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
    // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
  ],
};

const ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start("#firebaseui-auth-container", uiConfig);

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/v8/firebase.User
    const uid = user.uid;
    console.log("user:", uid);
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    console.log("user is signed out");
    localStorage.removeItem("user");
  }
});
