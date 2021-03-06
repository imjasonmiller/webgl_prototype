const path = require("path")
const webpack = require("webpack")

const client = {
  name: "client",
  mode: "development",
  target: "web",
  context: path.resolve(__dirname, ".."),
  entry: ["./src/client.entry.jsx"],
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
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "img/",
              name: "[hash].[ext]",
            },
          },
          {
            loader: "image-webpack-loader",
            options: {
              bypassOnDebug: true,
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
      {
        test: /\.glsl$/,
        loader: "file-loader",
        options: {
          outputPath: "shaders/",
          name: "[hash].[ext]",
        },
        include: path.resolve("src", "static", "shaders"),
      },
      {
        test: /\.ico$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
        include: path.resolve("src", "static", "images"),
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    modules: ["node_modules", path.resolve(__dirname, "..", "src")],
  },
  plugins: [
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
  mode: "development",
  name: "server",
  target: "node",
  context: path.resolve(__dirname, ".."),
  entry: ["./src/server.entry.jsx"],
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
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              emitFile: false,
              outputPath: "img/",
              name: "[hash].[ext]",
            },
          },
          {
            loader: "image-webpack-loader",
            options: {
              bypassOnDebug: true,
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
      {
        test: /\.glsl$/,
        loader: "file-loader",
        options: {
          emitFile: false,
          outputPath: "shaders/",
          name: "[hash].[ext]",
        },
        include: path.resolve("src", "static", "shaders"),
      },
      {
        test: /\.ico$/,
        loader: "file-loader",
        options: {
          emitFile: false,
          name: "[name].[ext]",
        },
        include: path.resolve("src", "static", "images"),
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
