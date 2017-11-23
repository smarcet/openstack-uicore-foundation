const path     = require('path');
const webpack  = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var PRODUCTION  = process.env.NODE_ENV === 'production';

var plugins = [
    new ExtractTextPlugin({ filename: 'css/[name].css' }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        filename: '__common__.js',
        //chunks: ["main", "utils"],
        deepChildren: true
    })
];

var productionPlugins = [
    new webpack.optimize.UglifyJsPlugin({minimize: true}),
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    })
];

var devPlugins = [];

function styleLoader(loaders) {
    if (PRODUCTION)
        return ExtractTextPlugin.extract({ fallback: 'style-loader', use: loaders });
    return [ 'style-loader', ...loaders ];
}

/**
 *
 * @returns {object}
 */
function postCSSLoader() {
    return {
        loader: "postcss-loader",
        options: {
            plugins: function () {
                return [require("autoprefixer")];
            }
        }
    }
}

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'openstack-uicore-foundation.js',
        library: 'openstack-uicore-foundation',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {   test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ["env", "flow", "react"]
                }},
            {
                test: /\.css$/,
                exclude: /\.module\.css$/,
                use: styleLoader(['css-loader', postCSSLoader()])
            },
            {
                test: /\.less/,
                exclude: /\.module\.less/,
                use: styleLoader(['css-loader', postCSSLoader(), 'less-loader'])
            },
            {
                test: /\.scss/,
                exclude: /\.module\.scss/,
                use: styleLoader(['css-loader', postCSSLoader(), 'sass-loader'])
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: "url-loader?limit=10000&minetype=application/font-woff&name=fonts/[name].[ext]"
            },
            {
                test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: "file-loader?name=fonts/[name].[ext]"
            },
            {
                test: /\.jpg|\.png|\.gif$/,
                use: "file-loader?name=images/[name].[ext]"
            },
            {
                test: /\.svg/,
                use: "file-loader?name=svg/[name].[ext]!svgo-loader"
            }
        ]
    },
    plugins: PRODUCTION
        ? plugins.concat(productionPlugins)
        : plugins.concat(devPlugins),
};