const path = require('path');

module.exports = {
  mode: 'development',
  entry: './integration-bootstrap.ts',
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
      'react-yoga-dom': '../../',
    },
  },
  output: {
    filename: 'test-bundle.js',
    path: path.resolve(__dirname),
  },
};
