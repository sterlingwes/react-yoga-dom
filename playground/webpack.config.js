const path = require('path');
const LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
  mode: 'development',
  entry: './index.tsx',
  context: path.resolve(__dirname),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      'react-yoga-dom': '../',
    },
  },
  plugins: [new LiveReloadPlugin()],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../playground-site'),
  },
};
