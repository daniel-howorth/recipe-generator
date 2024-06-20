const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    login: "./src/js/login.js",
    "search-recipes": "./src/js/search-recipes.js",
    "analyse-recipes": "./src/js/analyse-recipes.js",
    "calculate-macros": "./src/js/calculate-macros.js",
    "saved-recipes": "./src/js/saved-recipes.js",
    profile: "./src/js/profile.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    clean: true,
  },
  devtool: "eval-source-map",
  watch: true,
  mode: "development",
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      chunks: ["index"],
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],
  devServer: {
    contentBase: "./dist",
  },
};
