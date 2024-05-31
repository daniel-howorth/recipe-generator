import { validateInput } from "./utils.js";
import firebase from "./index.js";
import { signOutUser, getCurrentUserId } from "./auth.js";
import { saveRecipe } from "./db.js";
import { buildRecipeCard, cleanRecipeData } from "./recipe-processor.js";

const searchBtn = document.querySelector("button.search-btn");

let currentRecipeData = {};

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
      displayRecipe(cleanedData);
      // saveRecipe(getCurrentUserId(), currentRecipeData);
    } else {
      // display no results - make its own function?
      displayRecipe("");
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

  return url;
}

async function getRecipes(url, options) {
  try {
    const response = await fetch(url, options);
    if (response.ok) {
      const result = await response.json();
      return result.results?.[0] || "";
    } else {
      throw new Error(response.status);
    }
  } catch (error) {
    console.error("Fetch", error);
    window.alert("Sorry, there was a problem.");
  }
}

function formatInput(input) {
  return input.trim().split(" ").join("");
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

function applyToggleContentEventListeners() {
  document
    .querySelectorAll(".toggle-content-btn")
    .forEach((button) => button.addEventListener("click", toggleContent));
}

function hideSearchForm() {
  document.querySelector("#nutritional-requirements").classList.add("hidden");
  document
    .querySelector("#searchFormToggleIcon")
    .setAttribute("src", "../../assets/chevron-down.svg");
  window.scrollTo(0, 0);
}

function displayRecipe(data) {
  const recipeWrapper = document.querySelector(".recipe-wrapper");
  recipeWrapper.classList.remove("hidden");

  // clear any existing recipe data
  while (recipeWrapper.firstChild) {
    recipeWrapper.removeChild(recipeWrapper.firstChild);
  }

  // ******** check *********
  // if no results, display message.
  if (!data) {
    const noResultsMsg = `<div class="centered-text"><span>Could not find any recipes. Try tweaking your requirements.</span></div>`;
    const recipeCard = document.createElement("article");
    recipeCard.setAttribute("class", "recipe card");
    recipeCard.innerHTML = noResultsMsg;
    recipeWrapper.appendChild(recipeCard);
    return;
  }

  const recipeCard = buildRecipeCard(data);
  recipeWrapper.appendChild(recipeCard);

  applyToggleContentEventListeners();
}

applyToggleContentEventListeners();

const logoutBtns = document.querySelectorAll(".logout");
logoutBtns.forEach((btn) => btn.addEventListener("click", signOutUser));

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log("current user:", user.uid);
  } else {
    window.location.href = "index.html";
  }
});
