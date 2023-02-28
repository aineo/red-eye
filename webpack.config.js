const path = require("path");

module.exports = {
	mode: "development",
	entry: "./src/index.tsx",
	output: {
		path: path.resolve(__dirname, "./public"),
		filename: "bundle.js",
	},
	resolve: {
		extensions: [".js", ".ts", ".tsx"]
	},
	module: {
		rules: [
			{
				test: /\.(ts|js)x?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: [["@babel/preset-typescript", {allowNamespaces: true}]]
						}
					}
				]
			},
		]
	},
	devServer: {
		port: 5000,
		open: true,
		hot: true,
	},
}
