const MiniCssExtractPlugin      = require("mini-css-extract-plugin");
const path                      = require('path');

module.exports = {
    entry: {
        'components': './src/components.js',
        'methods': './src/methods.js',
        'actions': './src/actions.js',
        'reducers': './src/reducers.js',
    },
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: '[name].js',
        library: 'openstack-uicore-foundation',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    node: {fs: 'empty'},
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                "@babel/preset-env",
                                { "targets": { "node": "current" } }
                            ],
                            '@babel/preset-react',
                            '@babel/preset-flow'
                        ],
                        plugins: ['@babel/plugin-proposal-object-rest-spread']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.less/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"]
            },
            {
                test: /\.scss/,
                exclude: /\.module\.scss/,
                use: [MiniCssExtractPlugin.loader, "css-loader", 'sass-loader']
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
            },
            {
                test: /\.yaml$/,
                use: 'js-yaml-loader',
            }
        ]
    },
    externals: [
        "awesome-bootstrap-checkbox",
        "awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css",
        "font-awesome",
        "moment",
        "moment-timezone",
        "react",
        "prop-types",
        "react-bootstrap",
        "react-datetime",
        "react-dnd",
        "react-dnd-html5-backend",
        "react-dom",
        "react-dropzone",
        "react-google-maps",
        "react-google-maps/lib/components/addons/MarkerClusterer",
        "react-hot-loader",
        "react-redux",
        "react-router",
        "react-router-dom",
        "react-rte-ref-fix",
        "react-scroll",
        "react-select",
        "react-select/creatable",
        "react-select/async",
        "react-select/async-creatable",
        "react-star-ratings",
        "react-tooltip",
        "redux",
        "redux-persist",
        "redux-thunk",
        "sweetalert2",
        "urijs",
        "url-loader",
        "validator"
    ]
};
