/* eslint-disable */

const functions = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const cors = require("cors")({ origin: true }); // change origin when app is deployed
const fetch = require("node-fetch");
const { formatInput } = require("./utils");

// const apiKey = functions.config().spoonacularapi.apikey;
const apiKey = "5ade7491ccmsh53c0bf4987bab29p1d39bajsnda79064f7111";
const baseURL = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?instructionsRequired=true&addRecipeInstructions=true&addRecipeNutrition=true&fillIngredients=true&number=1`;
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": apiKey,
    "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    "Content-Type": "application/json",
  },
};

function buildUrl(searchTerms) {
  // random offset is generated each time buildUrl is called
  let url = `${baseURL}&offset=${Math.floor(Math.random() * 900)}`;

  for (const searchTerm of searchTerms) {
    if (searchTerm.value) {
      url += `&${searchTerm.key}=${formatInput(searchTerm.value)}`;
    }
  }

  return url;
}

exports.getrecipedata = onRequest(
  { region: "europe-west2", cors: true },
  async (req, res) => {
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "POST");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.status(204).send("");
      return;
    }

    cors(req, res, async () => {
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
          logger.log("request successful");
          res.status(200).json(result);
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
