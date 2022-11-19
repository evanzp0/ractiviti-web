const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');

function htmlpack_option(modulename, in_filename, out_path) {

    let out_filename = out_path != null ? out_path + modulename + '.html' : modulename + '.html';
    return {
        inject: true,
        chunks: [modulename],
        template: path.resolve(__dirname, in_filename),
        filename: out_filename,
    };
}

module.exports = {
    entry: {
        home: './web/modules/home/index',
        sign_in: './web/modules/sign_in/index',
    },
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, "target/debug/web"),
        filename: 'assets/modules/[name].[contenthash:8].js',
        chunkFilename: 'assets/modules/[name].[chunkhash:8].chunk.js',
    },
    mode: 'production',
    performance: {
        "maxEntrypointSize": 10000000,
        "maxAssetSize": 30000000
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },

        ]
    },
    plugins: [
        new HtmlWebpackPlugin(htmlpack_option('home', './web/common/template/index.html')),
        new HtmlWebpackPlugin(htmlpack_option('sign_in', './web/modules/sign_in/index.html')),
        new HtmlWebpackPlugin(htmlpack_option('bpmn', './web/modules/bpmn/index.html')),
        new CopyPlugin({
            patterns: [
                { from: "./web/robots.txt", to: "./" },
                { from: "./web/assets", to: "./assets" },
                {from: "./log4rs_config.yaml", to: "../"},
                {from: "./config.yaml", to: "../"}
            ],
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
            }),
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'target/debug/web'),
        },
        compress: true,
        port: 9000,
        hot: false,
    },
    // watchOptions: {
    //     aggregateTimeout: 10,
    //     poll: 50, // Check for changes every second
    //     ignored: ['**/node_modules'],
    // },
};
