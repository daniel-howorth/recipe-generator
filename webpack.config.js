const path = require("path");

module.exports = {
  // entry points
  entry: {
    login: "./src/js/login.js",
    "search-recipes": "./src/js/search-recipes.js",
    "analyse-recipes": "./src/js/analyse-recipes.js",
    "calculate-macros": "./src/js/calculate-macros.js",
    "saved-recipes": "./src/js/saved-recipes.js",
  },
  // The location of the build folder
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  devtool: "eval-source-map",
  watch: true,
  mode: "development",
};
