import firebase from "./index.js";

const uiConfig = {
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

const ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start("#firebaseui-auth-container", uiConfig);

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const uid = user.uid;
    console.log("user:", uid);
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    console.log("user is signed out");
    localStorage.removeItem("user");
  }
});
