import firebase from "./index.js";

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
