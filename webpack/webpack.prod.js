require("dotenv").config()

const path = require("path")
const webpack = require("webpack")
const nodeExternals = require("webpack-node-externals")
const Uglify = require("uglifyjs-webpack-plugin")

const client = {
  name: "client",
  target: "web",
  context: path.resolve(__dirname, ".."),
  entry: "./src/client.entry.jsx",
  output: {
    path: path.resolve(__dirname, "..", "build"),
    filename: "client.js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          babelrc: true,
          presets: [
            ["@babel/env", { modules: false, useBuiltIns: "entry" }],
            "@babel/react",
            "@babel/preset-stage-0",
          ],
          plugins: ["react-hot-loader/babel"],
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: "file-loader",
        options: {
          outputPath: "fonts/",
          name: "[hash].[ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    modules: ["node_modules", path.resolve(__dirname, "..", "src")],
  },
  plugins: [
    new webpack.DefinePlugin({
      DEV: false,
      HOST: JSON.stringify(process.env.HOST || "localhost"),
      PORT: JSON.stringify(process.env.PORT || 8080),
      HTTPS: JSON.stringify(process.env.HTTPS ? "https" : "http"),
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    new Uglify(),
  ],
}

const server = {
  name: "server",
  target: "node",
  context: path.resolve(__dirname, ".."),
  entry: "./src/server.entry.jsx",
  output: {
    path: path.resolve(__dirname, "..", "build"),
    filename: "server.js",
    libraryTarget: "commonjs2",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          babelrc: false,
          presets: [
            [
              "@babel/env",
              {
                targets: {
                  node: "current",
                },
                modules: false,
              },
            ],
            "@babel/react",
            "@babel/preset-stage-0",
          ],
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: "file-loader",
        options: {
          emitFile: false,
          outputPath: "fonts/",
          name: "[hash].[ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    modules: ["node_modules", path.resolve(__dirname, "..", "src")],
  },
  externals: [nodeExternals()],
  plugins: [
    new webpack.DefinePlugin({
      DEV: true,
      APP_HOST: JSON.stringify(process.env.APP_HOST || "localhost"),
      APP_PORT: JSON.stringify(process.env.APP_PORT || 8080),
      APP_HTTPS: JSON.stringify(process.env.APP_HTTPS ? "https" : "http"),
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    new Uglify(),
  ],
}

module.exports = [client, server]
