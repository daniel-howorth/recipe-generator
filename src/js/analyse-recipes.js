import { isNumber } from "./utils.js";
import firebase from "./index.js";
import { signOutUser } from "./auth.js";
import { getModal } from "./modal.js";

const analyseRecipeBtn = document.querySelector(".search-btn");
const nutritionalBreakdown = document.querySelector(".nutritional-breakdown");

const mobileMenuBtn = document.querySelector("#mobile-menu-btn");
const mobileMenuContainer = document.querySelector("#mobile-menu-modal");
const mobileMenuModal = getModal(mobileMenuContainer);
mobileMenuBtn.addEventListener("click", () => mobileMenuModal.show());

const baseURL = "https://api.calorieninjas.com/v1/";

const options = {
  method: "GET",
  headers: {
    "X-Api-Key": "otwN11CyK793zyZWAPVYxw==1duRAouoQBu4a844",
    "Content-Type": "application/json",
  },
};

analyseRecipeBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const inputValue = document.querySelector("#recipeToAnalyse").value;
  if (inputValue) {
    const url = buildUrl(inputValue);
    const recipeData = await analyseRecipe(url, options);
    displayNutrition(inputValue, recipeData);
  }
});

function buildUrl(inputValue) {
  return baseURL + "nutrition?query=" + inputValue;
}

async function analyseRecipe(url, options) {
  try {
    const response = await fetch(url, options);
    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      throw new Error(response.status);
    }
  } catch (error) {
    console.error("Fetch", error);
    window.alert("Sorry, there was a problem.");
  }
}

// return the sum of each nutrient value
function getTotalNutrients(data) {
  return {
    calories: data.items.every(
      (item) => item.hasOwnProperty("calories") && isNumber(item.calories)
    )
      ? Math.round(data.items.reduce((acc, item) => acc + item.calories, 0))
      : "n/a",
    protein: data.items.every(
      (item) => item.hasOwnProperty("protein_g") && isNumber(item.protein_g)
    )
      ? Math.round(data.items.reduce((acc, item) => acc + item.protein_g, 0)) +
        "g"
      : "n/a",
    carbs: data.items.every(
      (item) =>
        item.hasOwnProperty("carbohydrates_total_g") &&
        isNumber(item.carbohydrates_total_g)
    )
      ? Math.round(
          data.items.reduce((acc, item) => acc + item.carbohydrates_total_g, 0)
        ) + "g"
      : "n/a",
    fat: data.items.every(
      (item) => item.hasOwnProperty("fat_total_g") && isNumber(item.fat_total_g)
    )
      ? Math.round(
          data.items.reduce((acc, item) => acc + item.fat_total_g, 0)
        ) + "g"
      : "n/a",
    fiber: data.items.every(
      (item) => item.hasOwnProperty("fiber_g") && isNumber(item.fiber_g)
    )
      ? Math.round(data.items.reduce((acc, item) => acc + item.fiber_g, 0)) +
        "g"
      : "n/a",
    sugar: data.items.every(
      (item) => item.hasOwnProperty("sugar_g") && isNumber(item.sugar_g)
    )
      ? Math.round(data.items.reduce((acc, item) => acc + item.sugar_g, 0)) +
        "g"
      : "n/a",
  };
}

function displayNutrition(inputValue, data) {
  document
    .querySelector(".nutritional-breakdown-wrapper")
    .classList.remove("hidden");

  // clear any existing data
  while (nutritionalBreakdown.firstChild) {
    nutritionalBreakdown.removeChild(nutritionalBreakdown.firstChild);
  }

  // if no results, display message
  if (data.items.length === 0) {
    const noResultsMsg = `<div class="centered-text"><span>Sorry, we could not find any results.</span></div>`;
    nutritionalBreakdown.innerHTML = noResultsMsg;
    nutritionalBreakdown.scrollIntoView({ behavior: "smooth" });
    return;
  }

  const nutrients = getTotalNutrients(data);

  const nutritionalBreakdownHTML = `
      <h1>Nutritional Content</h1>
      <p>Recipe: ${inputValue}</p>
      <div id="nutritional-content">
        <div class="nutrition-stat">
          <div class="nutrition-stat-content">${nutrients.calories}</div>
          <span class="nutrition-stat-label">Calories</span>
        </div>
        <div class="nutrition-stat">
          <div class="nutrition-stat-content">${nutrients.protein}</div>
          <span class="nutrition-stat-label">Protein</span>
        </div>
        <div class="nutrition-stat">
          <div class="nutrition-stat-content">${nutrients.carbs}</div>
          <span class="nutrition-stat-label">Carbs</span>
        </div>
        <div class="nutrition-stat">
          <div class="nutrition-stat-content">${nutrients.fat}</div>
          <span class="nutrition-stat-label">Fat</span>
        </div>
        <div class="nutrition-stat">
          <div class="nutrition-stat-content">${nutrients.fiber}</div>
          <span class="nutrition-stat-label">Fiber</span>
        </div>
        <div class="nutrition-stat">
          <div class="nutrition-stat-content">${nutrients.sugar}</div>
          <span class="nutrition-stat-label">Sugar</span>
        </div>
      </div>
    </div>
  `;

  nutritionalBreakdown.innerHTML = nutritionalBreakdownHTML;
  nutritionalBreakdown.scrollIntoView({ behavior: "smooth" });
}

const logoutBtns = document.querySelectorAll(".logout");
logoutBtns.forEach((btn) => btn.addEventListener("click", signOutUser));

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log("current user:", user.uid);
  } else {
    window.location.href = "index.html";
  }
});
