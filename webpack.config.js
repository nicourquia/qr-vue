const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const plugins = [
  new CleanWebpackPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(nodeEnv),
    },
  }),
  new webpack.ProvidePlugin({
    THREE: 'three',
  }),
  new HtmlWebpackPlugin({
    title: 'Carta Digital Admin',
    template: '!!ejs-loader!src/index.html',
    baseUrl: nodeEnv === 'development' ? '/' : '/admin/',
    paypalClientId:
      nodeEnv === 'development'
        ? 'AaEA-ia_luPHx7nCgsoYyWlCrW0KArNBwhnnfLe1G9QOyRkL5KEyRLtTVHbKu5pDRN2zUrQjlw78PPGl'
        : 'AQW1aB91P0tbDfL4CvFJDQrnSB72sZyNDrn9sqfZ6tU7nHBqLWJr56uqvbg2KslaMJkHTevmPjsBpYEk',
  }),
  new VueLoaderPlugin(),
  new webpack.LoaderOptionsPlugin({
    options: {
      tslint: {
        emitErrors: true,
        failOnHint: true,
      },
    },
  }),
];

var config = {
  devtool: isProd ? undefined : 'source-map',
  //devtool: isProd ? 'hidden-source-map' : 'source-map',
  context: path.resolve('./src'),
  entry: ['@babel/polyfill', './index.ts'],
  output: {
    path: path.resolve('./dist'),
    filename: '[name].bundle.[hash].js',
    publicPath: nodeEnv === 'development' ? '/' : '/admin/',
  },
  module: {
    rules: [
      {
        test: /\.(gif|svg|jpg|png)$/,
        loader: 'file-loader',
      },
      {
        test: /node_modules[\/\\](iconv-lite)[\/\\].+/,
        resolve: {
          aliasFields: ['main'],
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(j|t)s(x)?$/,
        // Exclude the untransformed packages from the exclude rule here
        exclude: /node_modules\/(?!(ws|xhr2|gmap-vue|vue-js-modal|v-tooltip|vue-stripe-checkout|vue-tel-input-vuetify|vue2-perfect-scrollbar)\/).*/,
        use: ['babel-loader'],
      },
      /*{
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
      },*/
      { test: /\.html$/, loader: 'html-loader' },
      {
        test: /\.css$/,
        loaders: [
          'vue-style-loader',
          {
            loader: 'style-loader',
            options: {
              insert: function insertAtTop(element) {
                var parent = document.querySelector('head');
                // eslint-disable-next-line no-underscore-dangle
                var lastInsertedElement =
                  window._lastElementInsertedByStyleLoader;

                if (!lastInsertedElement) {
                  parent.insertBefore(element, parent.firstChild);
                } else if (lastInsertedElement.nextSibling) {
                  parent.insertBefore(element, lastInsertedElement.nextSibling);
                } else {
                  parent.appendChild(element);
                }

                // eslint-disable-next-line no-underscore-dangle
                window._lastElementInsertedByStyleLoader = element;
              },
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            // Requires sass-loader@^7.0.0
            options: {
              implementation: require('sass'),
            },
            // Requires sass-loader@^8.0.0
            options: {
              implementation: require('sass'),
              sassOptions: {},
            },
          },
        ],
      },
    ].filter(Boolean),
  },
  resolve: {
    alias: {
      cannon: path.resolve(__dirname, './src/lib/cannon/cannon.js'),
      vue$: 'vue/dist/vue.esm.js',
      './images/layers.png$': path.resolve(
        __dirname,
        './node_modules/leaflet/dist/images/layers.png'
      ),
      './images/layers-2x.png$': path.resolve(
        __dirname,
        './node_modules/leaflet/dist/images/layers-2x.png'
      ),
      './images/marker-icon.png$': path.resolve(
        __dirname,
        './node_modules/leaflet/dist/images/marker-icon.png'
      ),
      './images/marker-icon-2x.png$': path.resolve(
        __dirname,
        './node_modules/leaflet/dist/images/marker-icon-2x.png'
      ),
      './images/marker-shadow.png$': path.resolve(
        __dirname,
        './node_modules/leaflet/dist/images/marker-shadow.png'
      ),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'],
  },
  plugins: plugins,
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    //contentBase: path.join(__dirname, 'dist/'),
    compress: true,
    host: '0.0.0.0',
    historyApiFallback: true,
    port: 3001,
    hot: true,
  },
};

module.exports = config;
