import firebase from "./index.js";
import { getAllSavedRecipes } from "./db.js";
import { getCurrentUserId } from "./auth.js";

let savedRecipes = "";

firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    console.log("current user:", user.uid);
    savedRecipes = await getAllSavedRecipes(user.uid);
  } else {
    window.location.href = "index.html";
  }
});
