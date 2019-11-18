const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');


const DEV_ENV = 'development';
const PROD_ENV = 'production';
const { NODE_ENV = DEV_ENV } = process.env;

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './index.html',
  filename: 'index.html'
});

const Uglify = () => new UglifyJsPlugin({
  cache: false,
  sourceMap: false,
  parallel: true,
  uglifyOptions: {
    warnings: false,
    compress: true,
    comments: false,
    ecma: 6,
    mangle: true,
    output: null,
    toplevel: false,
    nameCache: null,
    ie8: false,
    keep_fnames: false,
  },
});

const GZip = () => new CompressionPlugin({
  compressionOptions: { level: 9 },
  filename: '[path].gz[query]',
  algorithm: 'gzip',
  test: /\.js(\?.*)?$/i,
  threshold: 10240,
  minRatio: 0.8
});


const config = {
  target: 'web',
  entry: [
    './index.js',
  ],
  output: {
    path: path.resolve(__dirname, './public'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-0'],
            plugins: [
              'transform-react-jsx',
              'transform-runtime'
            ]
          }
        }
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    stats: 'errors-only',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    }),
    HtmlWebpackPluginConfig
  ],
  devtool: 'inline-source-map',
};

if (NODE_ENV === DEV_ENV) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

if (NODE_ENV === PROD_ENV) {
  config.optimization = { minimizer: [Uglify()] };
  config.plugins.push(GZip());
}

module.exports = config;
