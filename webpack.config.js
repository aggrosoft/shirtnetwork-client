const path = require('path');
const webpack = require('webpack');
const env = process.env.BROWSERSLIST_ENV || 'production'

if (env === 'modern') {
  module.exports = {
    entry: path.resolve(__dirname, './src/index.js'),
    plugins: [
      new webpack.DefinePlugin({
        'BROWSERSLIST_ENV': JSON.stringify(env)
      })
    ],
    module: {
      rules: [
        {
          test: /\.m?js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    },
    devtool: false,
    devServer: {
      contentBase: './dist'
    },
    resolve: {
      extensions: ['*', '.js']
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'shirtnetwork-client.mjs',
      library: {
        name: 'ShirtnetworkClient',
        type: 'window',
        export: 'default'
      }
    }
  };
} else {
  module.exports = {
    entry: path.resolve(__dirname, './src/index.js'),
    plugins: [
      new webpack.DefinePlugin({
        'BROWSERSLIST_ENV': JSON.stringify(env)
      })
    ],
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        }
      ]
    },
    devtool: false,
    devServer: {
      contentBase: './dist'
    },
    resolve: {
      extensions: ['*', '.js']
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'shirtnetwork-client.js',
      library: {
        name: 'ShirtnetworkClient',
        type: 'window',
        export: 'default'
      }
    }
  };
}
