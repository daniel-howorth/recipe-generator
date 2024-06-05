import firebase from "./index.js";
import { getAllSavedRecipes, deleteRecipe } from "./db.js";
import { getCurrentUserId } from "./auth.js";
// import A11yDialog from "a11y-dialog";
import { getModal, displayModalWithContent } from "./modal.js";
import { buildRecipeCard } from "./recipe-processor.js";

const savedRecipesContainer = document.querySelector(
  "#saved-recipes-container"
);

const modalContentWrapper = document.querySelector(".modal-content-wrapper");
const container = document.querySelector("#modal");
// const dialog = new A11yDialog(container);
const modal = getModal(container);

let savedRecipes = [];

// get and display user's saved recipes on page load
firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    console.log("current user:", user.uid);
    savedRecipes = await getAllSavedRecipes(user.uid);
    if (savedRecipes.length) {
      displaySavedRecipes(savedRecipes);
    } else {
      displayNoSavedRecipesMsg();
    }
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
        <button class="view-recipe-details-btn" data-id="${savedRecipeDoc.id}">
          <img src="../assets/view.svg" alt="eye"/>
          <div class="visually-hidden">view recipe details</div>
        </button>
        <button class="delete-btn" data-id="${savedRecipeDoc.id}">
          <img src="../assets/delete.svg" alt="bin"/>
          <div class="visually-hidden">delete recipe</div>
        </button>
      </div>
    </article>
  `;

  savedRecipeCard.innerHTML = savedRecipeCardHTML;
  savedRecipeCard
    .querySelector(".delete-btn")
    .addEventListener("click", deleteSavedRecipe);
  savedRecipeCard
    .querySelector(".view-recipe-details-btn")
    .addEventListener("click", viewRecipeDetails);

  return savedRecipeCard;
};

async function viewRecipeDetails() {
  // while (modalContentWrapper.firstChild) {
  //   modalContentWrapper.removeChild(modalContentWrapper.firstChild);
  // }
  const recipeData = savedRecipes.find(
    (recipe) => recipe.id === this.dataset.id
  );
  const recipeDetailsCard = buildRecipeCard(recipeData);
  // recipeDetailsCard.classList.add("modal-content");
  // recipeDetailsCard.setAttribute("role", "document");
  // modalContentWrapper.appendChild(recipeDetailsCard);
  displayModalWithContent(recipeDetailsCard, modalContentWrapper, modal);
  applyToggleContentEventListeners();

  // modal.show();
}

async function deleteSavedRecipe() {
  const recipe = document.querySelector(`#id_${this.dataset.id}`);
  recipe.remove();
  savedRecipes.splice(
    savedRecipes.findIndex((recipe) => {
      recipe.id === this.dataset.id;
    }),
    1
  );
  if (!savedRecipes.length) {
    displayNoSavedRecipesMsg();
  }
  await deleteRecipe(getCurrentUserId(), this.dataset.id);
}

const displayNoSavedRecipesMsg = () => {
  const noSavedRecipesMsg = document.createElement("div");
  noSavedRecipesMsg.setAttribute("class", "card-wrapper");
  noSavedRecipesMsg.innerHTML = `<div class="card centered-text">You have no saved recipes.</div>`;
  savedRecipesContainer.appendChild(noSavedRecipesMsg);
};

export function applyToggleContentEventListeners() {
  document
    .querySelectorAll(".toggle-content-btn")
    .forEach((button) => button.addEventListener("click", toggleContent));
}

function toggleContent() {
  const content = document.querySelector(`#${this.dataset.toggle}`);
  const toggleIcon = this.querySelector("img");

  if (toggleIcon.getAttribute("src").includes("chevron-down")) {
    toggleIcon.setAttribute("src", "../../assets/chevron-up.svg");
  } else {
    toggleIcon.setAttribute("src", "../../assets/chevron-down.svg");
  }

  content.classList.toggle("hidden");
}
