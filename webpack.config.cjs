const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
  },
  entry: "./templates/scripts/toc.ts",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "toc.js",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "templates/html/toc.xhtml",
          to: "./",
        },
          { from: 'templates/style/toc.css', to: './' },
      ],
    }),
  ],
};
