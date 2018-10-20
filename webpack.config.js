const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'source-map',

    mode: 'none',

    entry: './src/index.ts',

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: "[name].js",
    },

    module: {
        // Make missing exports an error instead of warning
        strictExportPresence: true,

        rules: [
            //--- Rules for Typescript
            {
                test: /\.ts$/,
                loader: "ts-loader"
            },
            //--- Rules for Style Sheets
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },

    resolve: {
        extensions: ['.ts', '.js', '.json']
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: "initial",
                    name: "vendor",
                    test: "vendor",
                    enforce: true
                }
            }
        }
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
        })
    ]
};
