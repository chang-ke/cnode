const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  //devtool: "inline-eval-source-map",
  entry: {
    main: path.join(__dirname, "../src/index.js"),
    common: ["react", "react-dom"]
  },
  output: {
    path: path.join(__dirname, "../build"),
    filename: "[name].[hash].js",
    publicPath: "/cnode",
    chunkFilename: "[name].[chunkhash].async.js"
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /(node_modules)/,
        loader: "babel-loader?cacheDirectory=true"
      }
    ]
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({ name: "common", filename: "common.bundle.js" }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.join(__dirname, "../public/index.html")
    })
  ]
};
