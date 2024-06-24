const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    index: "./src/js/index.js",
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
    new HtmlWebpackPlugin({
      template: "./src/search-recipes.html",
      filename: "search-recipes.html",
      chunks: ["search-recipes"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/analyse-recipes.html",
      filename: "analyse-recipes.html",
      chunks: ["analyse-recipes"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/calculate-macros.html",
      filename: "calculate-macros.html",
      chunks: ["calculate-macros"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/saved-recipes.html",
      filename: "saved-recipes.html",
      chunks: ["saved-recipes"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/profile.html",
      filename: "profile.html",
      chunks: ["profile"],
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
    open: true,
  },
};
