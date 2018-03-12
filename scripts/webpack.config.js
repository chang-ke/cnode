const webpack = require("webpack");
const path = require("path");
const webpackConfigBase = require("./webpack.base.config");
const merge = require("webpack-merge");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const webpackConfigProd = {
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new webpack
      .optimize
      .UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
    new webpack
      .optimize
      .ModuleConcatenationPlugin(),
    new CleanWebpackPlugin(["build"], {
      root: path.join(__dirname, "../")
    })
  ]
};

module.exports = merge(webpackConfigBase, webpackConfigProd);
