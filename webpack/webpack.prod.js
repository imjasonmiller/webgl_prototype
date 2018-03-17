require("dotenv").config()

const path = require("path")
const webpack = require("webpack")
const nodeExternals = require("webpack-node-externals")
const Uglify = require("uglifyjs-webpack-plugin")
const CompressionPlugin = require("compression-webpack-plugin")
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")

const client = {
  name: "client",
  mode: "none",
  target: "web",
  context: path.resolve(__dirname, ".."),
  entry: "./src/client.entry.jsx",
  output: {
    path: path.resolve(__dirname, "..", "build", "public"),
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
          outputPath: "/",
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
      DEV: false,
      CLIENT: true,
      APP_HOST: JSON.stringify(process.env.APP_HOST || "localhost"),
      APP_PORT: JSON.stringify(process.env.APP_PORT || 8080),
      APP_HTTPS: JSON.stringify(process.env.APP_HTTPS ? "https" : "http"),
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    new webpack.ProvidePlugin({
      THREE: "three",
    }),
    new Uglify(),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    // new BundleAnalyzerPlugin(),
  ],
}

const server = {
  name: "server",
  mode: "none",
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
          outputPath: "/",
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
  externals: [nodeExternals()],
  plugins: [
    new webpack.DefinePlugin({
      DEV: false,
      CLIENT: false,
      APP_HOST: JSON.stringify(process.env.APP_HOST || "localhost"),
      APP_PORT: JSON.stringify(process.env.APP_PORT || 8080),
      APP_HTTPS: JSON.stringify(process.env.APP_HTTPS ? "https" : "http"),
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    new webpack.IgnorePlugin(/GLTFLoader/),
    new webpack.ProvidePlugin({
      THREE: "three",
    }),
    new Uglify(),
  ],
}

module.exports = [client, server]
