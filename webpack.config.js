const path = require("path");

module.exports = {
  // entry points
  entry: {
    "search-recipes": "./src/js/search-recipes.js",
    "analyse-recipes": "./src/js/analyse-recipes.js",
    "calculate-macros": "./src/js/calculate-macros.js",
  },
  // The location of the build folder
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  // Optional and for development only. This provides the ability to
  // map the built code back to the original source format when debugging.
  devtool: "eval-source-map",
  watch: true,
  mode: "development",
};
