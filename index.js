const searchBtn = document.querySelector("button.search-btn");
const cuisineInput = document.querySelector("#input-cuisine");
const dietInput = document.querySelector("#input-diet");
const mealTypeInput = document.querySelector("#input-type");
const intolerancesInput = document.querySelector("#input-intolerances");
const minCaloriesInput = document.querySelector("#input-minCalories");
const maxCaloriesInput = document.querySelector("#input-maxCalories");
const minProteinInput = document.querySelector("#input-minProtein");
const maxProteinInput = document.querySelector("#input-maxProtein");
const minCarbsInput = document.querySelector("#input-minCarbs");
const maxCarbsInput = document.querySelector("#input-maxCarbs");
const minFatInput = document.querySelector("#input-minFat");
const maxFatInput = document.querySelector("#input-maxFat");

const baseURL = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?instructionsRequired=true&addRecipeInstructions=true&addRecipeNutrition=true&number=1`;

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

  // if (inputIsValid) {
  //   const url = buildUrl(allInputs)
  //   getRecipes(url)
  // }
});

function validateInput(inputs) {
  let validStates = [];

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

async function getRecipes() {
  // random offset is generated each time getRecipes is called
  let url = `${baseURL}&offset=${Math.floor(Math.random() * 900)}`;

  if (cuisineInput.value) {
    let cuisine = formatInput(cuisineInput.value);
    url = `${url}&cuisine=${cuisine}`;
  }

  if (dietInput.value) {
    let diet = formatInput(dietInput.value);
    url = `${url}&diet=${diet}`;
  }

  if (mealTypeInput.value) {
    let mealType = formatInput(mealTypeInput.value);
    url = `${url}&type=${mealType}`;
  }

  if (intolerancesInput.value) {
    let intolerances = formatInput(intolerancesInput.value);
    url = `${url}&intolerances=${intolerances}`;
  }

  if (minCaloriesInput.value) {
    url = `${url}&minCalories=${minCaloriesInput.value}`;
  }

  if (maxCaloriesInput.value) {
    url = `${url}&maxCalories=${maxCaloriesInput.value}`;
  }

  if (minProteinInput.value) {
    url = `${url}&minProtein=${minProteinInput.value}`;
  }

  if (maxProteinInput.value) {
    url = `${url}&maxProtein=${maxProteinInput.value}`;
  }

  if (minCarbsInput.value) {
    url = `${url}&minCarbs=${minCarbsInput.value}`;
  }

  if (maxCarbsInput.value) {
    url = `${url}&maxCarbs=${maxCarbsInput.value}`;
  }

  if (minFatInput.value) {
    url = `${url}&minFat=${minFatInput.value}`;
  }

  if (maxFatInput.value) {
    url = `${url}&maxFat=${maxFatInput.value}`;
  }

  console.log(url);

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
