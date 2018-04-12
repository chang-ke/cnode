const webpack = require("webpack");
const path = require("path");
const merge = require("webpack-merge");
const webpackConfigBase = require("./webpack.base");
const OpenBrowserPlugin = require("open-browser-webpack-plugin");

const webpackConfigDev = {
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /(node_modules)/,
        loader: "babel-loader?cacheDirectory=true"
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development")
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "runtime"
    }),
    new OpenBrowserPlugin({ url: "http://localhost:8080" })
  ],
  devServer: {
    contentBase: path.join(__dirname, "../public"),
    historyApiFallback: true,
    host: "0.0.0.0",
    hot: true,
    inline: true,
    port: 8080, //, //端口你可以自定义
    proxy: {
      "/api/v1": {
        target: "https://cnodejs.org",
        changeOrigin: true
      }
    }
  }
};

module.exports = merge(webpackConfigBase, webpackConfigDev);
