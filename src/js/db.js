import firebase from "./index.js";
import "firebase/compat/firestore";

const db = firebase.firestore();

export const saveRecipe = async (userId, recipeData) => {
  try {
    console.log("saving recipe", recipeData);
    await db
      .collection("users")
      .doc(userId)
      .collection("savedRecipes")
      .doc(recipeData.id)
      .set({
        title: recipeData.title,
        image: recipeData.image,
        readyIn: recipeData.readyIn,
        servings: recipeData.servings,
        nutrients: recipeData.nutrients,
        ingredientsList: recipeData.ingredientsList,
        instructionsList: recipeData.instructionsList,
        sourceName: recipeData.sourceName,
        sourceUrl: recipeData.sourceUrl,
      });
    console.log("recipe saved");
  } catch (error) {
    console.error("error saving recipe: ", error);
    window.alert("There was a problem saving the recipe.");
  }
};

export const checkSavedRecipe = async (userId, recipeId) => {
  try {
    const recipeRef = db
      .collection("users")
      .doc(userId)
      .collection("savedRecipes")
      .doc(recipeId);
    const docSnapshot = await recipeRef.get();
    return docSnapshot.exists;
  } catch (error) {
    console.error("error checking if recipe is saved: ", error);
  }
};

export const deleteRecipe = async (userId, recipeId) => {
  try {
    await db
      .collection("users")
      .doc(userId)
      .collection("savedRecipes")
      .doc(recipeId)
      .delete();
    console.log("successfully deleted recipe");
  } catch (error) {
    console.error("error deleting recipe: ", error);
    window.alert("There was a problem deleting the recipe.");
  }
};

export const getAllSavedRecipes = async (userId) => {
  try {
    const querySnapshot = await db
      .collection("users")
      .doc(userId)
      .collection("savedRecipes")
      .get();

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("could not get recipes: ", error);
  }
};
