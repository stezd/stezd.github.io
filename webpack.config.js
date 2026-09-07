const webpack = require('webpack');
const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');



module.exports = {
  mode: 'development',
  entry: './src/index.ts',

  output: {
    // Explicit because CleanWebpackPlugin reads compiler.options.output.path
    // and disables itself when it's missing
    path: path.resolve(process.cwd(), 'dist'),
  },

  plugins: [
    new OptimizeCssAssetsPlugin(),
    new CleanWebpackPlugin(),
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({ filename: 'main.css' }),
    new CopyPlugin([
      {
        from: 'src/dist/',
        to: './',
        // These are emitted by webpack above, copying them again would duplicate them.
        // The android-chrome icons are only referenced from site.webmanifest (plain text,
        // not processed by webpack), so they are still copied as-is.
        ignore: [
          'apple-touch-icon.png',
          'favicon-16x16.png',
          'favicon-32x32.png',
          'site.webmanifest'
        ],
      },
    ]),
  ],

  module: {
    rules: [
      {
        test: /.(js)?$/,
        loader: 'script-loader',
        include: [],
        exclude: [/node_modules/]
      },
      {
        test: /.(ts|tsx)?$/,
        loader: 'ts-loader',
        include: [],
        exclude: [/node_modules/]
      },
      {
        test: /.(css)$/,
        use: [{
          loader: 'file-loader',
          options: {
            esModule: false,
            publicPath: './',
          }
        },
        'extract-loader',
        {
          loader: "css-loader",
          options: {
            sourceMap: false
          }
        }
        ]
      },
      {
        test: /.(less)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'main.css',
            esModule: false,
            publicPath: './',
          }
        },
        'extract-loader',
        {
          loader: "css-loader",
          options: {
            sourceMap: false
          }
        },
        {
          loader: "less-loader",
          options: {
            sourceMap: true
          }
        }]
      },
      {
        test: /.pug$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'index.html',
              publicPath: './'
            }
          },
          'extract-loader',
          {
            loader: "html-loader",
            options: {
              attrs: ["img:src", "link:href"]
            }
          },
          'pug-html-loader'
        ]
      },
      {
        test: /\.(png|webmanifest)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            esModule: false,
            publicPath: './'
          }
        }]
      },
      {
        test: /\.(svg|jpg|webp|woff(2)?|ttf|eot)/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'static/[hash].[ext]',
            esModule: false,
            publicPath: './'
          }
        }]
      }
    ]
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },

  optimization: {
    minimizer: [new TerserPlugin()],
  }
}
