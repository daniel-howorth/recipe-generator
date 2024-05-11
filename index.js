const baseURL = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com";

const url = `${baseURL}/recipes/complexSearch?instructionsRequired=true&addRecipeInformation=true&offset=${Math.floor(
  Math.random() * 900
)}&number=1`;

const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "5ade7491ccmsh53c0bf4987bab29p1d39bajsnda79064f7111",
    "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    "Content-Type": "application/json",
  },
};

const getRecipes = async () => {
  try {
    const response = await fetch(url, options);
    const results = await response.json();
    console.log(results);
  } catch {
    console.log("there was an error");
  }
};

// getRecipes();
