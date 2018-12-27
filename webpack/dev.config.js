// Webpack config for development
const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const config = require('../src/config');

const resolve = dir => path.join(__dirname, '..', dir);
const rootPath = path.resolve(__dirname, '..');
const host = (process.env.HOST || 'localhost');
const port = (+process.env.PORT + 1) || 3001;

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  context: rootPath,
  entry: {
    main: [
      `webpack-hot-middleware/client?path=http://${host}:${port}/__webpack_hmr`,
      'semantic-ui-less/semantic.less',
      resolve('src/client.js')
    ]
  },
  output: {
    path: resolve('uma_dwh/static/dist'),
    filename: 'main_source.js',
    publicPath: `http://${host}:${port}/`
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'eslint-loader'
          }
        ]
      },
      {
        test: /\.less$/,
        include: [resolve('src')],
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[local]___[hash:base64:5]',
              sourceMap: true
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.less$/,
        include: [resolve('node_modules/semantic-ui-less')],
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        include: [resolve('node_modules/react-table/react-table.css')],
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff'
            }
          }
        ]
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff'
            }
          }
        ]
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/octet-stream'
            }
          }
        ]
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'image/svg+xml'
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240
            }
          }
        ]
      }
    ]
  },
  resolve: {
    modules: [
      resolve('src'),
      'node_modules'
    ],
    extensions: ['.json', '.js', '.jsx'],
    alias: {
      '../../theme.config$': resolve('semantic-ui-theme/theme.config'),
      glamorous: resolve('node_modules/glamorous/dist/glamorous.esm.js')
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      },
      __DEVELOPMENT__: true,
      __HTTPS_ENABLED__: config.env.httpsEnabled,
      __APP_TITLE__: JSON.stringify(config.app.title)
    }),
    new HtmlWebPackPlugin({
      template: resolve('uma_dwh/static/templates/index.dev.html'),
      filename: './index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
