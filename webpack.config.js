const resolve = require('path').resolve
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const url = require('url')
const WebpackNotifierPlugin = require('webpack-notifier')
const publicPath = ''
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

// TODO
// 1 CommonsChunkPlugin配置 从react-adomin-temp移植过来

module.exports = (options = {}) => ({
  entry: {
    vendor: './src/vendor',
    // babel-polyfill es6兼容性 也可以在入口文件import不写在这里
    index: ['babel-polyfill', './src/main.js']
  },
  output: {
    // options.dev npm run 传过来的？
    // publicPath如何理解？
    path: resolve(__dirname, 'dist'),
    filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
    chunkFilename: '[id].js?[chunkhash]',
    publicPath: options.dev ? '/assets/' : publicPath
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        include: [resolve(__dirname, 'src')],
        // 一定要加这个 否则检测不到
        enforce: 'pre',
        use: [{
          loader: 'eslint-loader',
          options: {
            // 不符合Eslint规则时只console warning(默认false 直接error)
            // emitWarning: true
          }
        }]
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: ['vue-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.styl$/,
        use: ['style-loader', 'css-loader', 'stylus-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }]
      }]
  },
  plugins: [
    new webpack.DefinePlugin({
      // vue源码入口会判断process.env.NODE_ENV是development还是production做优化处理
      // 比如：让UglifyJS 之类的压缩工具完全丢掉仅供开发环境的代码块，以减少最终的文件尺寸
      // 所以DefinePlugin 定义 process.env.NODE_ENV 让vue源码及业务组件可以读取到process.env.NODE_ENV
      'process.env.NODE_ENV': options.dev ? JSON.stringify('development') : JSON.stringify('production')
    }),
    // 这里配置错误 参考下面 TODO
    // https://www.jb51.net/article/131865.htm
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    // main.js el:#app 挂载在src/index.html的#app
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    // 编译完成动态通知是否有error
    // new WebpackNotifierPlugin({
    //   title: 'Notify',
    //   excludeWarnings: true,
    //   skipFirstNotification: true
    // })
    // 控制台打印
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        // package.json cross-env传参
        messages: [`PROXY_ENV: ${process.env.PROXY_ENV} -- options: ${JSON.stringify(options)}`],
        notes: ['Some additionnal notes to be displayed unpon successful compilation']
      },
      onErrors: function (severity, errors) {
      }
    })
  ],
  resolve: {
    // extensions: ['', '.js', '.vue'],
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  devServer: {
    host: 'localhost',
    port: 8100,
    // webpack.config.js中webpack-dev-server --inline --hot 热更新
    // 自动打开浏览器
    open: true,
    proxy: {
      // http://localhost:8888/api/index.php/xxx 转发到 http://beeossdev.egtest.cn:7777/api/index.php/xxx 跨域
      '/api/index.php/*': {
        target: 'http://beeossdev.egtest.cn:7777',
        changeOrigin: true
        /* pathRewrite: {
            '^/api': ''
            } */
      },
      '/api.php': {
        target: 'http://iot-dev-upgrade-center.egtest.cn:7777',
        changeOrigin: true
        /* pathRewrite: {
                '^/api': ''
            } */
      }
    },
    historyApiFallback: {
      index: url.parse(options.dev ? '/assets/' : publicPath).pathname
    }
  },
  devtool: options.dev ? '#eval-source-map' : '#source-map'
})
