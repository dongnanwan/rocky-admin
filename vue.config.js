
const AntDesignThemePlugin = require('antd-theme-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const options = {
  antDir: path.join(__dirname, './node_modules/ant-design-vue'), // antd包位置
  stylesDir: path.join(__dirname, './src/styles/theme'), // 主题文件所在文件夹
  varFile: path.join(__dirname, './src/styles/theme/variables.less'), // 自定义默认的主题色
  mainLessFile: path.join(__dirname, './src/styles/theme/index.less'), // 项目中其他自定义的样式（如果不需要动态修改其他样式，该文件可以为空）
  outputFilePath: path.join(__dirname, './public/color.less'), // 提取的less文件输出到什么地方
  themeVariables: ['@primary-color'], // 要改变的主题变量
  indexFileName: './public/index.html', // index.html所在位置
  generateOnce: false, // 是否只生成一次
};

module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 'primary-color': '#f5222d',
          // 'link-color': '#f5222d',
          // 'border-radius-base': '2px',
        },
        javascriptEnabled: true,
      },
    },
  },
  configureWebpack: {
    externals: {
      PassGuardCtrl: 'PassGuardCtrl',
    },
    plugins: [
      new AntDesignThemePlugin(options),
      new webpack.ProvidePlugin({
        'window.Quill': 'quill/dist/quill.js',
        Quill: 'quill/dist/quill.js',
      }),
    ],
  },
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico',
    },
  },
};
