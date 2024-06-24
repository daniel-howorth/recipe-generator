/* eslint-disable */

const functions = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const cors = require("cors")({
  origin: "https://recipe-generator-c1fdb.web.app",
});
const fetch = require("node-fetch");
const { formatInput } = require("./utils");

const spoonacularApiKey = defineSecret("SPOONACULAR_API_KEY");

const baseURL = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?instructionsRequired=true&addRecipeInstructions=true&addRecipeNutrition=true&fillIngredients=true`;

const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "",
    "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    "Content-Type": "application/json",
  },
};

function buildUrl(searchTerms) {
  let url = `${baseURL}`;

  for (const searchTerm of searchTerms) {
    if (searchTerm.value) {
      url += `&${searchTerm.key}=${formatInput(searchTerm.value)}`;
    }
  }

  return url;
}

exports.getrecipedata = onRequest(
  { region: "europe-west1", cors: true, secrets: [spoonacularApiKey] },
  async (req, res) => {
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "POST");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.status(204).send("");
      return;
    }

    cors(req, res, async () => {
      const apiKey = spoonacularApiKey.value();

      if (!apiKey) {
        logger.error("request attempted but API key not found");
        res.status(500).send("500 Error: API key not found");
      } else {
        options.headers["x-rapidapi-key"] = apiKey;
      }

      const searchTerms = req.body;

      if (
        !searchTerms ||
        Object.keys(searchTerms).length === 0 ||
        searchTerms.length === 0
      ) {
        res.status(400).send("400 Error: Missing search terms");
        return;
      }

      const url = buildUrl(searchTerms);

      try {
        logger.log(`sending request: ${url}`);
        const response = await fetch(url, options);
        if (response.ok) {
          const result = await response.json();
          const randomRecipe = result.results
            ? result.results[Math.floor(Math.random() * result.results.length)]
            : "";
          logger.log("request successful");
          res.status(200).json([randomRecipe]);
        } else {
          const errorDetails = await response.json().catch(() => ({}));
          throw new Error(
            `request failed with status ${response.status}: ${JSON.stringify(
              errorDetails
            )}`
          );
        }
      } catch (error) {
        logger.error(error.message);
        res.status(500).send(error.message);
      }
    });
  }
);
