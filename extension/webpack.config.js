const webpack = require("webpack");
const { ESBuildPlugin, ESBuildMinifyPlugin } = require("esbuild-loader");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { manifestTransform } = require("./scripts/transform");

module.exports = (env, options) => {
  return {
    entry: {
      background: "./src/background.js",
      option: "./src/option-page/index.js"
    },
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: { loader: "worker-loader" }
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            "webpack-remove-debug",
            {
              loader: "esbuild-loader",
              options: {
                loader: "jsx",
                target: "es2015"
              }
            },
            "eslint-loader"
          ]
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [
            "file-loader",
            {
              loader: "image-webpack-loader",
              options: {
                bypassOnDebug: true, // webpack@1.x
                disable: true // webpack@2.x and newer
              }
            }
          ]
        }
      ]
    },
    optimization: {
      minimize: false,
      minimizer: [new ESBuildMinifyPlugin()]
    },
    resolve: {
      extensions: ["*", ".js", ".jsx", ".json"]
    },
    output: {
      path: __dirname + "/dist",
      publicPath: "/",
      filename: "[name].bundle.js"
    },
    devtool: "inline-sourcemap",
    plugins: [
      new ESBuildPlugin(),
      new CopyWebpackPlugin(
        [
          { from: "./src/option-page/option.html", force: true },
          { from: "./src/app/", force: true }
        ],
        {}
      ),
      new CopyWebpackPlugin([
        {
          from: "./src/app/manifest.json",
          force: true,
          transform(content, path) {
            return manifestTransform(content, path, options);
          }
        }
      ]),
      new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
      contentBase: "./dist",
      hot: true
    }
  };
};
