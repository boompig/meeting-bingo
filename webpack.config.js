var webpack = require("webpack");
var path = require("path");

// we want to resolve requirejs paths during build time

module.exports = {
    //context: __dirname + "/public/js/src",
    context: __dirname + "/components",
    entry: "./main.jsx",
    output: {
        path: "public/js/dist",
        filename: "meeting-bingo.bundle.js"
    },
    //resolve: {
        //root: __dirname,
        //alias: {
            //"jquery": "node_modules/jquery"
        //}
    //},
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
