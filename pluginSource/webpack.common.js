const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = "./src/";

module.exports = {
  entry: {
    popup: path.join(__dirname, srcDir + "/popup/popup.tsx"),
    background: path.join(__dirname, srcDir + "/background/background.ts"),
    tab: path.join(__dirname, srcDir + "/tab/tab.tsx"),
    selectionStyleInjection: path.join(
      __dirname,
      srcDir + "/styleInjection/selectionStyleInjection.ts"
    ),
    scrollbarStyleInjection: path.join(
      __dirname,
      srcDir + "/styleInjection/scrollbarStyleInjection.ts"
    ),
  },
  output: {
    path: path.join(__dirname, "./dist/js"),
    filename: "[name].js",
  },
  // optimization: {
  //   splitChunks: {
  //     name: "vendor",
  //     chunks: "initial",
  //   },
  // },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: [/node_modules/],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: ".", to: "..", context: "./public" }],
    }),
  ],
};
