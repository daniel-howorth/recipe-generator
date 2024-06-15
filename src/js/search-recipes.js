import { validateInput } from "./utils.js";
import firebase from "./index.js";
import { signOutUser, getCurrentUserId } from "./auth.js";
import { saveRecipe, checkSavedRecipe, deleteRecipe } from "./db.js";
import { buildRecipeCard, cleanRecipeData } from "./recipe-processor.js";
import { applyToggleContentEventListeners, formatInput } from "./utils.js";
import { getModal } from "./modal.js";

const mobileMenuBtn = document.querySelector("#mobile-menu-btn");
const mobileMenuContainer = document.querySelector("#mobile-menu-modal");
const mobileMenuModal = getModal(mobileMenuContainer);
mobileMenuBtn.addEventListener("click", () => mobileMenuModal.show());

const searchBtn = document.querySelector("button.search-btn");
const recipeWrapper = document.querySelector(".recipe-wrapper");

let currentRecipeData = {};
let recipeIsSaved = "";

const baseURL = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?instructionsRequired=true&addRecipeInstructions=true&addRecipeNutrition=true&fillIngredients=true&number=1`;

const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "5ade7491ccmsh53c0bf4987bab29p1d39bajsnda79064f7111",
    "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    "Content-Type": "application/json",
  },
};

searchBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  const allInputs = document.querySelectorAll("form input");
  const inputIsValid = validateInput(allInputs);

  if (inputIsValid) {
    const url = buildUrl(allInputs);
    const recipeData = await getRecipes(url, options);
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

function buildUrl(inputs) {
  // random offset is generated each time buildUrl is called
  let url = `${baseURL}&offset=${Math.floor(Math.random() * 900)}`;

  inputs.forEach((input) => {
    if (input.value) {
      url += `&${input.id}=${formatInput(input.value)}`;
    }
  });

  console.log(url);
  return url;
}

async function getRecipes(url, options) {
  try {
    const response = await fetch(url, options);
    if (response.ok) {
      const result = await response.json();
      console.log(result.results?.[0]);
      return result.results?.[0] || "";
    } else {
      throw new Error(response.status);
    }
  } catch (error) {
    console.error("Fetch", error);
    window.alert("Sorry, there was a problem finding recipes.");
  }
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
