
const webpack = require('webpack')
const path = require('path')
const resolve = (relatedPath) => path.resolve(__dirname, relatedPath)
const merge = require('webpack-merge')
const webpackConfigBase = require('./webpack.base.config')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const FileManagerPlugin = require('filemanager-webpack-plugin')

const webpackConfigProd = {
  output: {
    // 必须用chunkhash 否则manifest每次打包后hash都会变化就无法缓存了
    filename: '[name].[hash].js',
    // 部署到生产 path不能是根目录 都是打包出的index.html的同级目录
    publicPath: './'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      IS_DEVELOPMETN: false
    }),
    // 压缩优化代码
    new webpack.optimize.UglifyJsPlugin({ minimize: true }),
    // 打出zip包
    new FileManagerPlugin({
      onEnd: {
        mkdir: ['./dist-package'],
        archive: [
          {
            source: './dist', destination: './dist-package/dist.zip'
          }
        ]
      }
    })
    // http://localhost:3011/ 查看每个包大小 优化包大小用
    // new BundleAnalyzerPlugin({ analyzerPort: 3011 })
  ],
  devtool: 'source-map'
}

module.exports = merge(webpackConfigBase, webpackConfigProd)
