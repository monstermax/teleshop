
const path = require('path');

// npx webpack --watch
// OR
// npx webpack build

module.exports = {
    entry: './src/client/root.tsx',
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: 'react.bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
        ],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        port: 3098,
    },
    mode: 'development',
};
