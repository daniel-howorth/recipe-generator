import { isNumber, validateInput } from "./utils.js";
import firebase from "./index.js";
import { signOutUser, getCurrentUserId } from "./auth.js";
import { saveRecipe } from "./db.js";
import { buildRecipeCard } from "./recipe-processor.js";

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
    displayRecipe(recipeData);
    hideSearchForm();
    // saveRecipe(getCurrentUserId(), currentRecipeData);
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
      return result || {};
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

  // if no results, display message.
  if (!data?.results?.length) {
    const noResultsMsg = `<div class="centered-text"><span>Could not find any recipes. Try tweaking your requirements.</span></div>`;
    const recipeCard = document.createElement("article");
    recipeCard.setAttribute("class", "recipe card");
    recipeCard.innerHTML = noResultsMsg;
    recipeWrapper.appendChild(recipeCard);
    return;
  }

  const image = data.results[0].image || "assets/default-recipe-image.jpg";

  const title = data.results[0].title || "Recipe";

  const readyIn = data.results[0].readyInMinutes;

  // clean nutrients data
  const nutrients = data.results[0].nutrition?.nutrients || [];

  let calories = nutrients.find((nutrient) => nutrient.name === "Calories");
  calories =
    calories?.amount && isNumber(calories.amount)
      ? Math.round(calories.amount)
      : "n/a";

  let protein = nutrients.find((nutrient) => nutrient.name === "Protein");
  protein =
    protein?.amount && isNumber(protein.amount)
      ? `${Math.round(protein.amount)}g`
      : "n/a";

  let carbs = nutrients.find((nutrient) => nutrient.name === "Carbohydrates");
  carbs =
    carbs?.amount && isNumber(carbs.amount)
      ? `${Math.round(carbs.amount)}g`
      : "n/a";

  let fat = nutrients.find((nutrient) => nutrient.name === "Fat");
  fat =
    fat?.amount && isNumber(fat.amount) ? `${Math.round(fat.amount)}g` : "n/a";

  let fiber = nutrients.find((nutrient) => nutrient.name === "Fiber");
  fiber =
    fiber?.amount && isNumber(fiber.amount)
      ? `${Math.round(fiber.amount)}g`
      : "n/a";

  let sugar = nutrients.find((nutrient) => nutrient.name === "Sugar");
  sugar =
    sugar?.amount && isNumber(sugar.amount)
      ? `${Math.round(sugar.amount)}g`
      : "n/a";

  const servings = data.results[0].servings;

  const ingredientsList = data.results[0].extendedIngredients || [];

  const instructionsList =
    data.results[0].analyzedInstructions?.[0]?.steps || [];

  // currentRecipeData = {
  //   id: data.results[0].id.toString(),
  //   title: title,
  //   image: image,
  //   readyIn: readyIn,
  //   servings: servings,
  //   nutrients: [calories, protein, carbs, fat, fiber, sugar],
  //   ingredientsList: ingredientsList,
  //   instructionsList: instructionsList,
  // };

  currentRecipeData = {
    id: data.results[0].id.toString(),
    title: title,
    image: image,
    readyIn: readyIn,
    servings: servings,
    nutrients: {
      calories: calories,
      protein: protein,
      carbs: carbs,
      fat: fat,
      fiber: fiber,
      sugar: sugar,
    },
    ingredientsList: ingredientsList,
    instructionsList: instructionsList,
  };

  const recipeCard = buildRecipeCard(currentRecipeData);
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
