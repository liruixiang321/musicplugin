// 库打包的主要配置
// 引入vue-loader插件
// const {VueLoaderPlugin} = require('vue-loader');
const {VueLoaderPlugin} = require('vue-loader')
// 引入清除打包后文件的插件（最新版的需要解构，不然会报不是构造函数的错，而且名字必须写CleanWebpackPlugin）
// const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
// const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const path = require('path')
// const loader = require('sass-loader')
module.exports = {
  entry:path.resolve(__dirname,'../src/MusicPlugin.vue') ,
  mode:'production',
  // devtool:'source-map',
  output:{
    path:path.resolve(__dirname,'../dist'),
    filename:'musicPlugin.min.js',
    libraryTarget:'umd',
    libraryExport:'default',
    umdNamedDefine:true,
    clean:true
  },
  // 我们打包组件库时不需要把Vue打包进去
  externals: {
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue',
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },    
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 5120,
              esModule: false,
              fallback: 'file-loader',
              name: 'images/[name].[hash:4].[ext]',
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false,
              },
            },
          },
        ],
      },
      {
        test: /\.(scss|sass|css)$/,
        use: [
          'style-loader',
          'vue-style-loader',
          'css-loader',
          {
            loader: 'postcss-loader'
          },
          'sass-loader'
        ]
      },
      
    ],
  },
  plugins: [new VueLoaderPlugin()],
  resolve: {
    alias: {
      // vue$: 'vue/dist/vue.runtime.esm.js',
      // '@': path.resolve(__dirname, '../examples'),
      // UI: path.resolve(__dirname, '../packages/components'),
    },
    extensions: ['*', '.js', '.vue'],
  },
  optimization:{
    minimizer:[
        new TerserWebpackPlugin({
            parallel: true,
        })
    ]
}
}
