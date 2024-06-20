/* eslint-disable */

const functions = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const cors = require("cors")({ origin: true }); // change origin when app is deployed
const fetch = require("node-fetch");

const baseURL = "https://api.calorieninjas.com/v1/";
const options = {
  method: "GET",
  headers: {
    "X-Api-Key": "",
    "Content-Type": "application/json",
  },
};
const calorieninjasApiKey = defineSecret("CALORIENINJAS_API_KEY");

exports.getrecipeanalysis = onRequest(
  { region: "europe-west1", cors: true, secrets: [calorieninjasApiKey] },
  async (req, res) => {
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.status(204).send("");
      return;
    }

    cors(req, res, async () => {
      let apiKey = calorieninjasApiKey.value();

      if (!apiKey) {
        logger.error("request attempted but API key not found");
        res.status(500).send("500 Error: API key not found");
      } else {
        options.headers["X-Api-Key"] = apiKey;
      }

      let recipeQuery = req.query.recipeQuery;

      if (!recipeQuery) {
        res.status(400).send("400 Error: Missing query data");
        return;
      }

      const url = buildUrl(recipeQuery);

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

function buildUrl(query) {
  return baseURL + "nutrition?query=" + query;
}
