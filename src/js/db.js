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
      });
    console.log("recipe saved");
  } catch (error) {
    console.error("error saving recipe: ", error);
    window.alert("There was a problem saving the recipe.");
  }
};
