import "../css/main.css";
import "../css/saved-recipes.css";
import "../css/modal-styles.css";

import viewIcon from "../assets/view.svg";
import deleteIcon from "../assets/delete.svg";

import firebase from "./firebase-config.js";
import { getAllSavedRecipes, deleteRecipe } from "./db.js";
import { getCurrentUserId, signOutUser } from "./auth.js";
import { getModal, displayModalWithContent } from "./modal.js";
import { buildRecipeCard } from "./recipe-processor.js";
import { applyToggleContentEventListeners } from "./utils.js";

const mobileMenuBtn = document.querySelector("#mobile-menu-btn");
const mobileMenuContainer = document.querySelector("#mobile-menu-modal");
const mobileMenuModal = getModal(mobileMenuContainer);
mobileMenuBtn.addEventListener("click", () => mobileMenuModal.show());

const savedRecipesContainer = document.querySelector(
  "#saved-recipes-container"
);

const modalContent = document.querySelector(".modal-content");
const container = document.querySelector("#modal");
const modal = getModal(container);

let savedRecipes = [];
let deleteRecipeId = 0;

// get and display user's saved recipes on page load
firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    if (user.isAnonymous) {
      window.location.href = "index.html";
    } else {
      console.log("current user:", user.uid);
      savedRecipes = await getAllSavedRecipes(user.uid);
      if (savedRecipes.length) {
        displaySavedRecipes(savedRecipes);
      } else {
        displayNoSavedRecipesMsg();
      }
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
          <div class="visually-hidden">view recipe details</div>
        </button>
        <button class="delete-btn" data-id="${savedRecipeDoc.id}">
          <div class="visually-hidden">delete recipe</div>
        </button> 
      </div>
    </article>
  `;

  savedRecipeCard.innerHTML = savedRecipeCardHTML;

  const deleteBtnImg = document.createElement("img");
  deleteBtnImg.src = deleteIcon;
  deleteBtnImg.alt = "bin";

  const savedRecipeCardDeleteBtn = savedRecipeCard.querySelector(".delete-btn");
  savedRecipeCardDeleteBtn.prepend(deleteBtnImg);
  savedRecipeCardDeleteBtn.addEventListener("click", confirmRecipeDeletion);

  const viewBtnImg = document.createElement("img");
  viewBtnImg.src = viewIcon;
  viewBtnImg.alt = "eye";

  const savedRecipeCardViewBtn = savedRecipeCard.querySelector(
    ".view-recipe-details-btn"
  );
  savedRecipeCardViewBtn.prepend(viewBtnImg);
  savedRecipeCardViewBtn.addEventListener("click", viewRecipeDetails);

  return savedRecipeCard;
};

async function viewRecipeDetails() {
  const recipeData = savedRecipes.find(
    (recipe) => recipe.id === this.dataset.id
  );
  const recipeDetailsCard = buildRecipeCard(recipeData);
  displayModalWithContent(recipeDetailsCard, modalContent, modal);
  applyToggleContentEventListeners();
}

async function deleteSavedRecipe() {
  const recipe = document.querySelector(`#id_${deleteRecipeId}`);
  recipe.remove();
  savedRecipes.splice(
    savedRecipes.findIndex((recipe) => {
      recipe.id === deleteRecipeId;
    }),
    1
  );
  if (!savedRecipes.length) {
    displayNoSavedRecipesMsg();
  }
  await deleteRecipe(getCurrentUserId(), deleteRecipeId);
}

function confirmRecipeDeletion() {
  deleteRecipeId = this.dataset.id;
  const confirmContent = document.createElement("div");
  confirmContent.setAttribute("class", "confirm-modal");
  confirmContent.innerHTML = `
    <div class="confirm-modal">
      <span>Are you sure you want to delete this recipe?</span>
      <div class="confirm-modal-action-buttons">
        <button class="confirm-btn">Yes</button
        ><button class="cancel-btn">Cancel</button>
      </div>
    </div>`;

  confirmContent.querySelector(".confirm-btn").addEventListener("click", () => {
    deleteSavedRecipe();
    deleteRecipeId = 0;
    modal.hide();
  });
  confirmContent.querySelector(".cancel-btn").addEventListener("click", () => {
    deleteRecipeId = 0;
    modal.hide();
  });

  displayModalWithContent(confirmContent, modalContent, modal);
}

const displayNoSavedRecipesMsg = () => {
  const noSavedRecipesMsg = document.createElement("div");
  noSavedRecipesMsg.setAttribute("class", "card-wrapper");
  noSavedRecipesMsg.innerHTML = `<div class="card centered-text">You have no saved recipes.</div>`;
  savedRecipesContainer.appendChild(noSavedRecipesMsg);
};

const logoutBtns = document.querySelectorAll(".logout");
logoutBtns.forEach((btn) => btn.addEventListener("click", signOutUser));
