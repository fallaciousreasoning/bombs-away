const webpack = require('webpack');
const webpackUnionGeneratorPlugin = require('./union-generator/generator').default;

module.exports = {
    mode: 'development',
    entry: "./src/index.ts",
    output: {
        filename: "main.js",
        path: __dirname + "/dist"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        extensions: [".ts", ".ts", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.ts$/, loader: "awesome-typescript-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpackUnionGeneratorPlugin({
            fileGlobs: __dirname + '/src/components/',
            outputFile: __dirname + '/src/components/Component.ts',
            unionName: 'Component'
        })
    ],

    devServer: {
        hot: false,
        contentBase:  './dist',
    }
};