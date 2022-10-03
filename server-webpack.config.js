const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

module.exports = {
  devtool: isProd ? 'hidden-source-map' : 'source-map',
  context: path.resolve('./src'),
  entry: ['webpack/hot/poll?100', './server.ts'],
  watch: !isProd,
  target: 'node',
  node: {
    __filename: true,
    __dirname: true,
  },
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?100'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules/],
      },
    ],
  },
  mode: nodeEnv,
  resolve: {
    alias: {
      cannon: path.resolve(__dirname, './src/lib/cannon/cannon.js'),
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  output: {
    path: path.join(__dirname, 'dist-backend'),
    filename: 'server.js',
    //hotUpdateChunkFilename: 'hot-update.js', doesn't reload with this
    //hotUpdateMainFilename: 'hot-update.json'
  },
};
