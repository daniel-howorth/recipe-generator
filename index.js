const searchBtn = document.querySelector("button.search-btn");
const cuisineInput = document.querySelector("#input-cuisine");

const baseURL = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?instructionsRequired=true&addRecipeInformation=true&number=1`;

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
  getRecipes();
});

async function getRecipes() {
  // random offset is generated each time getRecipes is called
  let url = `${baseURL}&offset=${Math.floor(Math.random() * 900)}`;

  if (cuisineInput.value) {
    let cuisine = formatInput(cuisineInput.value);
    url = `${url}&cuisine=${cuisine}`;
  }

  try {
    const response = await fetch(url, options);
    if (response.ok) {
      const results = await response.json();
      console.log(results);
    } else {
      console.log("there was an error");
    }
  } catch {
    console.log("there was an error");
  }
}

function formatInput(input) {
  return input.trim().split(" ").join("");
}
