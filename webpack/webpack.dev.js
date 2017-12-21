const path = require("path")
const webpack = require("webpack")

const client = {
  name: "client",
  context: path.resolve(__dirname, ".."),
  entry: [
    "webpack-hot-middleware/client?name=client",
    "react-hot-loader/patch",
    "./src/client.entry.jsx",
  ],
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
            ["@babel/env", { modules: false, useBuiltIns: "usage" }],
            "@babel/react",
            "@babel/preset-stage-0",
          ],
          plugins: ["react-hot-loader/babel"],
        },
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1024,
              outputPath: "img/",
              name: "[hash].[ext]",
            },
          },
          {
            loader: "svgo-loader",
            options: {
              plugins: [
                { removeTitle: true },
                { convertColors: { shorthex: false } },
                { convertPathData: false },
                { cleanupIDs: { remove: false } },
                { removesComments: true },
              ],
            },
          },
        ],
        include: path.resolve("src", "static", "images"),
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: "file-loader",
        options: {
          outputPath: "fonts/",
          name: "[hash].[ext]",
        },
        include: path.resolve("src", "static", "fonts"),
      },
      {
        test: /\.glb$/,
        loader: "file-loader",
        options: {
          outputPath: "models/",
          name: "[hash].[ext]",
        },
        include: path.resolve("src", "static", "models"),
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    modules: ["node_modules", path.resolve(__dirname, "..", "src")],
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      THREE: "three",
    }),
    new webpack.DefinePlugin({
      DEV: true,
      CLIENT: true,
      APP_HOST: JSON.stringify(process.env.APP_HOST || "localhost"),
      APP_PORT: JSON.stringify(process.env.APP_PORT || 8080),
      APP_HTTPS: JSON.stringify(process.env.APP_HTTPS ? "https" : "http"),
    }),
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
        test: /\.svg$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1024,
              emitFile: false,
              outputPath: "img/",
              name: "[hash].[ext]",
            },
          },
          {
            loader: "svgo-loader",
            options: {
              plugins: [
                { removeTitle: true },
                { convertColors: { shorthex: false } },
                { convertPathData: false },
                { cleanupIDs: { remove: false } },
                { removesComments: true },
              ],
            },
          },
        ],
        include: path.resolve("src", "static", "images"),
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: "file-loader",
        options: {
          emitFile: false,
          outputPath: "fonts/",
          name: "[hash].[ext]",
        },
        include: path.resolve("src", "static", "fonts"),
      },
      {
        test: /\.glb$/,
        loader: "file-loader",
        options: {
          emitFile: false,
          outputPath: "models/",
          name: "[hash].[ext]",
        },
        include: path.resolve("src", "static", "models"),
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    modules: ["node_modules", path.resolve(__dirname, "..", "src")],
  },
  plugins: [
    new webpack.DefinePlugin({
      DEV: true,
      CLIENT: false,
      APP_HOST: JSON.stringify(process.env.APP_HOST || "localhost"),
      APP_PORT: JSON.stringify(process.env.APP_PORT || 8080),
      APP_HTTPS: JSON.stringify(process.env.APP_HTTPS ? "https" : "http"),
    }),
    new webpack.IgnorePlugin(/GLTFLoader/),
    new webpack.ProvidePlugin({
      THREE: "three",
    }),
  ],
}

module.exports = [client, server]
