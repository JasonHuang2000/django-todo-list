const path = require("path");

module.exports = {
  entry: {
    "main/js/homepage": "./assets/main/js/homepage.js",
    "main/js/list": "./assets/main/js/list.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "./static"),
  },
};
