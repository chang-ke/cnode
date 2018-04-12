const webpack = require("webpack");
const path = require("path");
const webpackConfigBase = require("./webpack.base");
const merge = require("webpack-merge");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const webpackConfigProd = {
  module: {
    rules: [
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                //localIdentName: "[local]__[hash:base64:5]",
                minimize: true
              }
            },
            {
              loader: "less-loader"
            }
          ]
        })
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                //localIdentName: "[local]__[hash:base64:5]",
                minimize: true
              }
            }
          ]
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("style.[hash:4].css"),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new CleanWebpackPlugin(["build"], {
      root: path.join(__dirname, "../")
    })
  ]
};

module.exports = merge(webpackConfigBase, webpackConfigProd);
