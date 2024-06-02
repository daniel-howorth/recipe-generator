import firebase from "./index.js";
import { getAllSavedRecipes, deleteRecipe } from "./db.js";
import { getCurrentUserId } from "./auth.js";

const savedRecipesContainer = document.querySelector(
  "#saved-recipes-container"
);

let savedRecipes = "";

// get and display user's saved recipes on page load
firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    console.log("current user:", user.uid);
    savedRecipes = await getAllSavedRecipes(user.uid);
    displaySavedRecipes(savedRecipes);
  } else {
    window.location.href = "index.html";
  }
});

const displaySavedRecipes = (savedRecipes) => {
  const savedRecipeCards = savedRecipes.map((savedRecipeDoc) =>
    buildSavedRecipeCard(savedRecipeDoc)
  );

  while (savedRecipesContainer.firstChild) {
    savedRecipesContainer.removeChild(savedRecipesContainer.firstChild);
  }

  for (let savedRecipeCard of savedRecipeCards) {
    savedRecipeCard
      .querySelector(".delete-btn")
      .addEventListener("click", deleteSavedRecipe);
    savedRecipesContainer.appendChild(savedRecipeCard);
  }
};

const buildSavedRecipeCard = (savedRecipeDoc) => {
  let savedRecipeCard = document.createElement("div");
  savedRecipeCard.setAttribute("class", "card-wrapper");
  savedRecipeCard.setAttribute("id", `id_${savedRecipeDoc.id}`);
  let savedRecipeCardHTML = `
    <article class="saved-recipe card">
      <div class="saved-recipe-img-wrapper">
        <img
          src="${savedRecipeDoc.image}"
          alt="food"
          class="saved-recipe-img"
        />
      </div>
      <div class="saved-recipe-title-wrapper">
        <span class="saved-recipe-title"
          >${savedRecipeDoc.title}</span
        >
      </div>
      <div class="saved-recipe-action-buttons">
        <button>
          <img src="../assets/view.svg" alt="eye" />
          <div class="visually-hidden">view recipe details</div>
        </button>
        <button class="delete-btn" data-id="${savedRecipeDoc.id}">
          <img src="../assets/delete.svg" alt="bin" data-id="${savedRecipeDoc.id}"/>
          <div class="visually-hidden">delete recipe</div>
        </button>
      </div>
    </article>
  `;
  savedRecipeCard.innerHTML = savedRecipeCardHTML;
  return savedRecipeCard;
};

const deleteSavedRecipe = async (e) => {
  const recipe = document.querySelector(`#id_${e.target.dataset.id}`);
  savedRecipesContainer.removeChild(recipe);
  await deleteRecipe(getCurrentUserId(), e.target.dataset.id);
};
