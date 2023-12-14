// webpack.prod.js
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/app.ts", // Adjust the entry file as needed
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devtool: "source-map",
  devServer: {
    static: './dist',
    compress: true,
    port: 9000,
    // other devServer options...
  },
};
