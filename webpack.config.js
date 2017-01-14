var webpack = require("webpack");
var path = require("path");

module.exports = {
    context: __dirname,
    entry: "./components/main.jsx",
    output: {
		path: "public/js/dist",
        filename: "meeting-bingo.bundle.js"
    },
    module: {
        loaders: [
            // use babel to convert ES6
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                query: {
                    presets: ["es2015", "react"]
                }
            }
        ]
    }
};
