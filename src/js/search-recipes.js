import { validateInput } from "./utils.js";
import firebase from "./index.js";
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

const getRecipesUrl =
  "https://europe-west2-recipe-generator-c1fdb.cloudfunctions.net/getrecipedata";

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
      return result.results?.[0] || "";
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
    .setAttribute("src", "../../assets/chevron-down.svg");
  window.scrollTo(0, 0);
}

function displayRecipe(data) {
  recipeWrapper.classList.remove("hidden");

  // clear any existing recipe data
  while (recipeWrapper.firstChild) {
    recipeWrapper.removeChild(recipeWrapper.firstChild);
  }

  const recipeCard = buildRecipeCard(data);
  const saveRecipeBtn = buildSaveRecipeBtn();
  recipeCard.appendChild(saveRecipeBtn);
  recipeWrapper.appendChild(recipeCard);

  applyToggleContentEventListeners();
}

const buildSaveRecipeBtn = () => {
  const saveButton = document.createElement("button");
  saveButton.setAttribute("class", "save-recipe-btn");

  const imgSrc = recipeIsSaved
    ? "../../assets/favourite.svg"
    : "../../assets/favourite-border.svg";

  saveButton.innerHTML = `
    <img src=${imgSrc} alt="heart" />
    <div class="visually-hidden">save recipe</div>
  `;
  saveButton.addEventListener("click", handleSaveRecipeBtnClick);
  return saveButton;
};

const handleSaveRecipeBtnClick = (e) => {
  if (recipeIsSaved) {
    // delete recipe from db
    deleteRecipe(getCurrentUserId(), currentRecipeData.id);
    e.target.setAttribute("src", "../../assets/favourite-border.svg");
    recipeIsSaved = false;
  } else {
    // save recipe to db
    saveRecipe(getCurrentUserId(), currentRecipeData);
    e.target.setAttribute("src", "../../assets/favourite.svg");
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
    console.log("current user:", user.uid);
  } else {
    window.location.href = "index.html";
  }
});
