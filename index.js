const searchBtn = document.querySelector("button.search-btn");
const cuisineInput = document.querySelector("#cuisine");
const dietInput = document.querySelector("#diet");
const mealTypeInput = document.querySelector("#type");
const intolerancesInput = document.querySelector("#intolerances");
const minCaloriesInput = document.querySelector("#minCalories");
const maxCaloriesInput = document.querySelector("#maxCalories");
const minProteinInput = document.querySelector("#minProtein");
const maxProteinInput = document.querySelector("#maxProtein");
const minCarbsInput = document.querySelector("#minCarbs");
const maxCarbsInput = document.querySelector("#maxCarbs");
const minFatInput = document.querySelector("#minFat");
const maxFatInput = document.querySelector("#maxFat");
const recipeCard = document.querySelector(".recipe");

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
    console.log(recipeData);
    displayRecipe(recipeData);
    hideSearchForm();
  }
});

function validateInput(inputs) {
  let validStates = []; // array of true and false flags

  inputs.forEach((input) => {
    // reset invalid styles first
    input.classList.remove("invalidInput");
    document
      .querySelector(`#${input.id} + .invalid-label`)
      .classList.add("hidden");

    if (input.value) {
      // test numeric inputs
      if (input.classList.contains("number-input")) {
        if (/^\d+$/.test(input.value)) {
          validStates.push(true);
        } else {
          validStates.push(false);
          input.classList.add("invalidInput");
          document
            .querySelector(`#${input.id} + .invalid-label`)
            .classList.remove("hidden");
        }
      } else {
        // test text inputs
        if (/^\w+(,\s?\w+)*$/.test(input.value)) {
          validStates.push(true);
        } else {
          validStates.push(false);
          input.classList.add("invalidInput");
          document
            .querySelector(`#${input.id} + .invalid-label`)
            .classList.remove("hidden");
        }
      }
    }
  });

  return validStates.every((state) => state);
}

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
      const results = await response.json();
      return results;
    }
  } catch {
    console.log("there was a network error");
  }
}

function formatInput(input) {
  return input.trim().split(" ").join("");
}

function toggleContent() {
  const content = document.querySelector(`#${this.dataset.toggle}`);
  const toggleIcon = this.querySelector("img");

  if (toggleIcon.getAttribute("src").includes("chevron-down")) {
    toggleIcon.setAttribute("src", "assets/chevron-up.svg");
  } else {
    toggleIcon.setAttribute("src", "assets/chevron-down.svg");
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
    .setAttribute("src", "assets/chevron-down.svg");
  window.scrollTo(0, 0);
}

function displayRecipe(data) {
  document.querySelector(".recipe-wrapper").classList.remove("hidden");

  // clear any existing recipe data
  while (recipeCard.firstChild) {
    recipeCard.removeChild(recipeCard.firstChild);
  }

  // if 0 results, display message.
  if (data.totalResults === 0) {
    const noResultsMsg = `<div style="text-align: center;"><span>Could not find any recipes. Try tweaking your requirements.</span></div>`;
    recipeCard.innerHTML = noResultsMsg;
    return;
  }

  const image = data.results[0].image || "assets/default-recipe-image.jpg";

  const title = data.results[0].title || "Recipe";

  const readyIn = data.results[0].readyInMinutes || "";

  // clean nutrients data
  const nutrients = data.results[0].nutrition.nutrients;

  let calories = nutrients.find((nutrient) => nutrient.name === "Calories");
  calories = calories ? Math.round(calories.amount) : "n/a";

  let protein = nutrients.find((nutrient) => nutrient.name === "Protein");
  protein = protein ? `${Math.round(protein.amount)}g` : "n/a";

  let carbs = nutrients.find((nutrient) => nutrient.name === "Carbohydrates");
  carbs = carbs ? `${Math.round(carbs.amount)}g` : "n/a";

  let fat = nutrients.find((nutrient) => nutrient.name === "Fat");
  fat = fat ? `${Math.round(fat.amount)}g` : "n/a";

  let fiber = nutrients.find((nutrient) => nutrient.name === "Fiber");
  fiber = fiber ? `${Math.round(fiber.amount)}g` : "n/a";

  let sugar = nutrients.find((nutrient) => nutrient.name === "Sugar");
  sugar = sugar ? `${Math.round(sugar.amount)}g` : "n/a";

  const servings = data.results[0].servings;

  const ingredientsList = data.results[0].extendedIngredients || [];

  const instructionsList = data.results[0].analyzedInstructions[0].steps || [];

  const recipeImgHTML = `
    <img
      src=${image}
      alt="food"
    />`;

  // conditionally render 'ready in' if data exists
  const recipeHeaderHTML = `
    <h1>${title}</h1>
    ${
      readyIn
        ? `<div class="ready-in">
            <div class="visually-hidden">ready in</div>
            <img src="assets/clock.svg" alt="clock" class="clock-icon" />
            <span>${readyIn} mins</span>
          </div>`
        : ""
    }`;

  const nutritionalContentHTML = `
    <header class="section-header">
      <h2>Nutrition per serving</h2>
      <button
        class="toggle-content-btn"
        data-toggle="nutritional-content"
      >
        <div class="visually-hidden">Toggle nutritional content.</div>
        <img src="assets/chevron-up.svg" alt="chevron" />
      </button>
    </header>

    <div id="nutritional-content">
      <div class="nutrition-stat">
        <div class="nutrition-stat-content">${calories}</div>
        <span class="nutrition-stat-label">Calories</span>
      </div>
      <div class="nutrition-stat">
        <div class="nutrition-stat-content">${protein}</div>
        <span class="nutrition-stat-label">Protein</span>
      </div>
      <div class="nutrition-stat">
        <div class="nutrition-stat-content">${carbs}</div>
        <span class="nutrition-stat-label">Carbs</span>
      </div>
      <div class="nutrition-stat">
        <div class="nutrition-stat-content">${fat}</div>
        <span class="nutrition-stat-label">Fat</span>
      </div>
      <div class="nutrition-stat">
        <div class="nutrition-stat-content">${fiber}</div>
        <span class="nutrition-stat-label">Fiber</span>
      </div>
      <div class="nutrition-stat">
        <div class="nutrition-stat-content">${sugar}</div>
        <span class="nutrition-stat-label">Sugar</span>
      </div>
    </div>`;

  let ingredientsSectionHTML = `
    <header class="section-header">
      <h2>Ingredients</h2>
      <button
        class="toggle-content-btn"
        data-toggle="ingredients-content"
      >
        <div class="visually-hidden">Toggle instructions.</div>
        <img src="assets/chevron-down.svg" alt="chevron" />
      </button>
    </header>
    <div class="hidden" id="ingredients-content">
      ${servings ? `<span>${servings} servings</span>` : ""}
      <ul class="ingredients-list">
  `;

  // conditionally render ingredients if data exists
  if (ingredientsList.length) {
    for (let ingredient of ingredientsList) {
      ingredientsSectionHTML += `<li>${
        ingredient.original ? ingredient.original : "n/a"
      }</li>`;
    }
  } else {
    ingredientsSectionHTML += `<li>No ingredients found. What's in the fridge?</li>`;
  }

  ingredientsSectionHTML += `</ul></div>`;

  let instructionsSectionHTML = `
    <header class="section-header">
      <h2>Instructions</h2>
      <button
        class="toggle-content-btn"
        data-toggle="instructions-content"
      >
        <div class="visually-hidden">Toggle instructions.</div>
        <img src="assets/chevron-down.svg" alt="chevron" />
      </button>
    </header>
    <ol class="hidden" id="instructions-content">
  `;

  // conditionally render instructions if data exists
  if (instructionsList.length) {
    for (let instruction of instructionsList) {
      instructionsSectionHTML += `<li>${
        instruction.step ? instruction.step : "n/a"
      }</li>`;
    }
  } else {
    instructionsSectionHTML += `<li>No instructions found. Just wing it.</li>`;
  }

  instructionsSectionHTML += `</ol>`;

  const recipeImg = document.createElement("div");
  recipeImg.classList.add("recipe-img-wrapper");
  recipeImg.innerHTML = recipeImgHTML;

  const recipeHeader = document.createElement("header");
  recipeHeader.classList.add("recipe-header");
  recipeHeader.innerHTML = recipeHeaderHTML;

  const nutritionalContent = document.createElement("section");
  nutritionalContent.classList.add("nutritional-content");
  nutritionalContent.innerHTML = nutritionalContentHTML;

  const ingredientsSection = document.createElement("section");
  ingredientsSection.classList.add("ingredients");
  ingredientsSection.innerHTML = ingredientsSectionHTML;

  const instructionsSection = document.createElement("section");
  instructionsSection.classList.add("instructions");
  instructionsSection.innerHTML = instructionsSectionHTML;

  recipeCard.appendChild(recipeImg);
  recipeCard.appendChild(recipeHeader);
  recipeCard.appendChild(nutritionalContent);
  recipeCard.appendChild(ingredientsSection);
  recipeCard.appendChild(instructionsSection);

  applyToggleContentEventListeners();
}

applyToggleContentEventListeners();
