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

const baseURL = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?instructionsRequired=true&addRecipeInstructions=true&addRecipeNutrition=true&fillIngredients=true&number=1`;

const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "5ade7491ccmsh53c0bf4987bab29p1d39bajsnda79064f7111",
    "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    "Content-Type": "application/json",
  },
};

searchBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const allInputs = document.querySelectorAll("form input");
  const inputIsValid = validateInput(allInputs);

  if (inputIsValid) {
    const url = buildUrl(allInputs);
    getRecipes(url, options);
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
      console.log(results);
    }
  } catch {
    console.log("there was a network error");
  }
}

function formatInput(input) {
  return input.trim().split(" ").join("");
}
