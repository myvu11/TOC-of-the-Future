const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  target: ["web", "es5"],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
  },
  entry: "./templates/scripts/future-toc.ts",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "future-toc.js",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "templates/style/", to: "./" },
        { from: "templates/html/", to: "./"}
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx"],
  },
};
