const config = require('../config')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const extractSass = new ExtractTextPlugin({
    filename: "style.css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
context: path.resolve(__dirname, '../'),  
  entry: {
      sass: './static/sass/style.scss'
  },
  output: {
    filename: 'dummy.js',
    path: config.build.assetsRoot,
  },
  watch: true,
  module: {
    rules: [
        {
            test: /\.scss$/,
            use: extractSass.extract({
                use: [{
                    loader: "css-loader"
                }, {
                    loader: "sass-loader"
                }],
                // use style-loader in development
                fallback: "vue-style-loader"
            })
        }
    ]
  },
  plugins: [
    extractSass,
    new MomentLocalesPlugin({
        localesToKeep: ['es', 'en'],
    }),      
    new BrowserSyncPlugin({
        // browse to http://localhost:3000/ during development, 
        // ./ directory is being served 
        host: 'localhost',
        open:false,
        port: 3000,
        files: ['./dist/*.html'],
        server: { baseDir: ['./dist','./'] }
      })
  ]
};