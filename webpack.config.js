// const webpack = require("webpack");
const path = require("path");
//const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
	entry: "./components/index.js",

	output: {
		path: path.resolve("public/js/dist"),
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
	},
	//plugins: [new BundleAnalyzerPlugin()],
};
