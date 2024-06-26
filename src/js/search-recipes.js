import "../css/main.css";
import "../css/modal-styles.css";

import chevronDownIcon from "../assets/chevron-down.svg";
import favouriteIcon from "../assets/favourite.svg";
import favouriteBorderIcon from "../assets/favourite-border.svg";

import { validateInput } from "./utils.js";
import firebase from "./firebase-config.js";
import { signOutUser, getCurrentUserId } from "./auth.js";
import { saveRecipe, checkSavedRecipe, deleteRecipe } from "./db.js";
import { buildRecipeCard, cleanRecipeData } from "./recipe-processor.js";
import { applyToggleContentEventListeners } from "./utils.js";
import { getModal } from "./modal.js";

const mobileMenuBtn = document.querySelector("#mobile-menu-btn");
const mobileMenuContainer = document.querySelector("#mobile-menu-modal");
const mobileMenuModal = getModal(mobileMenuContainer);
mobileMenuBtn.addEventListener("click", () => mobileMenuModal.show());

const searchBtn = document.querySelector("button.search-btn");
const recipeWrapper = document.querySelector(".recipe-wrapper");

let currentRecipeData = {};
let recipeIsSaved = "";

let userIsAnonymous = null;

const getRecipesUrl =
  "https://europe-west1-recipe-generator-c1fdb.cloudfunctions.net/getrecipedata";

searchBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  const allInputs = document.querySelectorAll("form input");
  const inputIsValid = validateInput(allInputs);

  if (inputIsValid) {
    const recipeData = await getRecipes(allInputs);
    if (recipeData) {
      const cleanedData = cleanRecipeData(recipeData);
      currentRecipeData = cleanedData;
      recipeIsSaved = await checkSavedRecipe(
        getCurrentUserId(),
        currentRecipeData.id
      );
      displayRecipe(cleanedData);
    } else {
      displayNoResultsMsg();
    }
    hideSearchForm();
  }
});

async function getRecipes(inputs) {
  const searchTerms = [...inputs].map((input) => ({
    key: input.id,
    value: input.value,
  }));

  try {
    const response = await fetch(getRecipesUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(searchTerms),
    });

    if (response.ok) {
      const result = await response.json();
      return result[0] || "";
    } else {
      let errorMsg;
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        errorMsg = await response.json();
      } else {
        errorMsg = await response.text();
      }
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error(error.message);
    window.alert("Sorry, there was a problem finding recipes.");
    return "";
  }
}

applyToggleContentEventListeners();

function hideSearchForm() {
  document.querySelector("#nutritional-requirements").classList.add("hidden");
  document
    .querySelector("#searchFormToggleIcon")
    .setAttribute("src", chevronDownIcon);
  window.scrollTo(0, 0);
}

function displayRecipe(data) {
  recipeWrapper.classList.remove("hidden");

  // clear any existing recipe data
  while (recipeWrapper.firstChild) {
    recipeWrapper.removeChild(recipeWrapper.firstChild);
  }

  const recipeCard = buildRecipeCard(data);

  if (!userIsAnonymous) {
    const saveRecipeBtn = buildSaveRecipeBtn();
    recipeCard.appendChild(saveRecipeBtn);
  }

  recipeWrapper.appendChild(recipeCard);

  applyToggleContentEventListeners();
}

const buildSaveRecipeBtn = () => {
  console.log(
    "getting user at point of building save button: ",
    firebase.auth().user
  );
  const saveButton = document.createElement("button");
  saveButton.classList.add("save-recipe-btn");
  const saveButtonImg = document.createElement("img");
  saveButtonImg.src = recipeIsSaved ? favouriteIcon : favouriteBorderIcon;
  saveButtonImg.alt = "heart";
  saveButton.appendChild(saveButtonImg);
  saveButton.innerHTML += `<div class="visually-hidden">save recipe</div>`;
  saveButton.addEventListener("click", handleSaveRecipeBtnClick);
  return saveButton;
};

const handleSaveRecipeBtnClick = (e) => {
  if (recipeIsSaved) {
    // delete recipe from db
    deleteRecipe(getCurrentUserId(), currentRecipeData.id);
    e.target.setAttribute("src", favouriteBorderIcon);
    recipeIsSaved = false;
  } else {
    // save recipe to db
    saveRecipe(getCurrentUserId(), currentRecipeData);
    e.target.setAttribute("src", favouriteIcon);
    recipeIsSaved = true;
  }
};

const displayNoResultsMsg = () => {
  recipeWrapper.classList.remove("hidden");

  while (recipeWrapper.firstChild) {
    recipeWrapper.removeChild(recipeWrapper.firstChild);
  }

  const noResultsMsg = `<div class="centered-text"><span>Could not find any recipes. Try tweaking your requirements.</span></div>`;
  const recipeCard = document.createElement("article");
  recipeCard.setAttribute("class", "recipe card");
  recipeCard.innerHTML = noResultsMsg;
  recipeWrapper.appendChild(recipeCard);
};

const logoutBtns = document.querySelectorAll(".logout");
logoutBtns.forEach((btn) => btn.addEventListener("click", signOutUser));

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    if (user.isAnonymous) {
      userIsAnonymous = true;
      console.log("current user: signed in anonymously");
      const personalisedFeatures = document.querySelectorAll(
        ".personalised-feature"
      );
      personalisedFeatures.forEach((feature) => {
        feature.classList.add("disabled");
        feature.addEventListener("click", (e) => {
          e.preventDefault();
          window.alert("You must create an account to use this feature.");
        });
      });
    } else {
      console.log("current user:", user.uid);
    }
  } else {
    window.location.href = "index.html";
  }
});
