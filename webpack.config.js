// const webpack = require("webpack");
const path = require("path");
//const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
	entry: "./src/index",

	output: {
		path: path.resolve("public/js/dist"),
		filename: "meeting-bingo.bundle.js"
	},

	resolve: {
		extensions: [".js", ".jsx", ".ts", ".tsx"]
	},

	devtool: "source-map",

	module: {
		rules: [
			// use babel to convert ES6
			{
				test: /\.jsx?$/,
				use: {
					loader: "babel-loader",
				},
				exclude: /node_modules/,
			}
		]
	},

	mode: "development"
	//plugins: [new BundleAnalyzerPlugin()],
};
