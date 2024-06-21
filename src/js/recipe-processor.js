import { isNumber } from "./utils";

import defaultRecipeImage from "../assets/default-recipe-image.jpg";
import clockIcon from "../assets/clock.svg";
import chevronUpIcon from "../assets/chevron-up.svg";
import chevronDownIcon from "../assets/chevron-down.svg";

export const cleanRecipeData = (data) => {
  const id = data.id.toString();
  const image = data.image || defaultRecipeImage;
  const title = data.title || "Recipe";
  const readyIn = data.readyInMinutes;
  const nutrients = data.nutrition?.nutrients || [];

  let calories = nutrients.find((nutrient) => nutrient.name === "Calories");
  calories =
    calories?.amount && isNumber(calories.amount)
      ? Math.round(calories.amount)
      : "";

  let protein = nutrients.find((nutrient) => nutrient.name === "Protein");
  protein =
    protein?.amount && isNumber(protein.amount)
      ? Math.round(protein.amount)
      : "";

  let carbs = nutrients.find((nutrient) => nutrient.name === "Carbohydrates");
  carbs =
    carbs?.amount && isNumber(carbs.amount) ? Math.round(carbs.amount) : "";

  let fat = nutrients.find((nutrient) => nutrient.name === "Fat");
  fat = fat?.amount && isNumber(fat.amount) ? Math.round(fat.amount) : "";

  let fiber = nutrients.find((nutrient) => nutrient.name === "Fiber");
  fiber =
    fiber?.amount && isNumber(fiber.amount) ? Math.round(fiber.amount) : "";

  let sugar = nutrients.find((nutrient) => nutrient.name === "Sugar");
  sugar =
    sugar?.amount && isNumber(sugar.amount) ? Math.round(sugar.amount) : "";

  const servings = data.servings;

  const ingredientsList = data.extendedIngredients || [];

  const instructionsList = data.analyzedInstructions?.[0]?.steps || [];

  return {
    id: id,
    title: title,
    image: image,
    readyIn: readyIn,
    nutrients: {
      calories: calories,
      protein: protein,
      carbs: carbs,
      fat: fat,
      fiber: fiber,
      sugar: sugar,
    },
    servings: servings,
    ingredientsList: ingredientsList,
    instructionsList: instructionsList,
    sourceName: data.sourceName,
    sourceUrl: data.sourceUrl,
  };
};

const getRecipeImageHTML = (imageUrl) => {
  return `
    <img
      src=${imageUrl}
      alt="food"
    />
  `;
};

const getRecipeHeaderHTML = (title, readyIn) => {
  return `
    <h1>${title}</h1>
    ${
      readyIn
        ? `<div class="ready-in">
            <div class="visually-hidden">ready in</div>
            <img src=${clockIcon} alt="clock" class="clock-icon" />
            <span>${readyIn} mins</span>
          </div>`
        : ""
    }
  `;
};

const getRecipeNutritionHTML = ({
  calories,
  protein,
  carbs,
  fat,
  fiber,
  sugar,
}) => {
  return `
    <header class="section-header">
      <h2>Nutrition per serving</h2>
      <button
        class="toggle-content-btn"
        data-toggle="nutritional-content"
      >
        <div class="visually-hidden">Toggle nutritional content.</div>
        <img src=${chevronUpIcon} alt="chevron" />
      </button>
    </header>

    <div id="nutritional-content">
      <div class="nutrition-stat">
        <div class="nutrition-stat-content">${calories ? calories : "n/a"}</div>
        <span class="nutrition-stat-label">Calories</span>
      </div>
      <div class="nutrition-stat">
        <div class="nutrition-stat-content">${
          protein ? protein + "g" : "n/a"
        }</div>
        <span class="nutrition-stat-label">Protein</span>
      </div>
      <div class="nutrition-stat">
        <div class="nutrition-stat-content">${carbs ? carbs + "g" : "n/a"}</div>
        <span class="nutrition-stat-label">Carbs</span>
      </div>
      <div class="nutrition-stat">
        <div class="nutrition-stat-content">${fat ? fat + "g" : "n/a"}</div>
        <span class="nutrition-stat-label">Fat</span>
      </div>
      <div class="nutrition-stat">
        <div class="nutrition-stat-content">${fiber ? fiber + "g" : "n/a"}</div>
        <span class="nutrition-stat-label">Fiber</span>
      </div>
      <div class="nutrition-stat">
        <div class="nutrition-stat-content">${sugar ? sugar + "g" : "n/a"}</div>
        <span class="nutrition-stat-label">Sugar</span>
      </div>
    </div>
  `;
};

const getIngredientsSectionHTML = (servings, ingredientsList) => {
  let ingredientsSectionHTML = `
    <header class="section-header">
      <h2>Ingredients</h2>
      <button
        class="toggle-content-btn"
        data-toggle="ingredients-content"
      >
        <div class="visually-hidden">Toggle instructions.</div>
        <img src=${chevronDownIcon} alt="chevron" />
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
  return ingredientsSectionHTML;
};

const getInstructionsSectionHTML = (instructionsList) => {
  let instructionsSectionHTML = `
    <header class="section-header">
      <h2>Instructions</h2>
      <button
        class="toggle-content-btn"
        data-toggle="instructions-content"
      >
        <div class="visually-hidden">Toggle instructions.</div>
        <img src=${chevronDownIcon} alt="chevron" />
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
  return instructionsSectionHTML;
};

const getSource = (sourceName, sourceUrl) => {
  const source = document.createElement("p");
  source.setAttribute("class", "recipe-source");
  source.innerHTML = `Source: <a href="${sourceUrl}" target="_blank">${sourceName}</a>`;
  return source;
};

export const buildRecipeCard = (recipeData) => {
  const recipeCard = document.createElement("article");
  recipeCard.setAttribute("class", "recipe card");

  const recipeImg = document.createElement("div");
  recipeImg.classList.add("recipe-img-wrapper");
  recipeImg.innerHTML = getRecipeImageHTML(recipeData.image);

  const recipeHeader = document.createElement("header");
  recipeHeader.classList.add("recipe-header");
  recipeHeader.innerHTML = getRecipeHeaderHTML(
    recipeData.title,
    recipeData.readyIn
  );

  const nutritionalContent = document.createElement("section");
  nutritionalContent.classList.add("nutritional-content");
  nutritionalContent.innerHTML = getRecipeNutritionHTML(recipeData.nutrients);

  const ingredientsSection = document.createElement("section");
  ingredientsSection.classList.add("ingredients");
  ingredientsSection.innerHTML = getIngredientsSectionHTML(
    recipeData.servings,
    recipeData.ingredientsList
  );

  const instructionsSection = document.createElement("section");
  instructionsSection.classList.add("instructions");
  instructionsSection.innerHTML = getInstructionsSectionHTML(
    recipeData.instructionsList
  );

  const source = getSource(recipeData.sourceName, recipeData.sourceUrl);

  recipeCard.appendChild(recipeImg);
  recipeCard.appendChild(recipeHeader);
  recipeCard.appendChild(nutritionalContent);
  recipeCard.appendChild(ingredientsSection);
  recipeCard.appendChild(instructionsSection);
  recipeCard.appendChild(source);

  return recipeCard;
};
