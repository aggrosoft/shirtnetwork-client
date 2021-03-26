const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
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
  plugins: [
    new BundleAnalyzerPlugin()
  ],
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