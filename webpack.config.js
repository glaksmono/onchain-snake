const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

var nodeExternals = require('webpack-node-externals');
var path = require('path');

module.exports = (env) => {
    return {
        mode: 'production',
        target: 'node',
        externals: [nodeExternals()],
        entry: path.join(__dirname, 'src', 'SnakeGame.jsx'),
        output: {
            path: path.resolve('lib'),
            filename: 'snake.js',
            libraryTarget: 'commonjs2',
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)?$/,
                    exclude: /(node_modules)/,
                    use: "babel-loader"
                },
                {
                    test: /\.css/,
                    use: ['style-loader', 'css-loader']
                },
            ]
        },
        plugins: [
            new Dotenv({
                path: './environments/.env'
            }),
        ],
    }
}